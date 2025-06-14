import { useState, useCallback, useRef, useEffect } from 'react'
import { useGameConfig } from './GameConfig'
import useFoods, { FoodItem, NewFood } from './Foods'
import { useAudioPlayer , AudioPlayer} from 'expo-audio'
import { useConfirmExit } from '@/hooks/usePreventNavigationExit'

export type GameManagerType = {
    startGame: () => void
    gameStarted: boolean
    setGameStarted: (gameStarted: boolean) => void
    score: number
    foods: FoodItem[]
    characterPosition: number
    setCharacterPosition: (position: number) => void
    endGame: () => void
    lifes: number
    checkCollisions: (callback: (foodType: string) => void) => void
    coins: number
    gameOver: boolean
    setGameOver: (gameOver: boolean) => void
    paused: boolean
    setPaused: (paused: boolean) => void
    pauseGame: () => void
    resumeGame: () => void
}

export const useGameManager = (): GameManagerType => {
    const [paused, setPaused] = useState(false)
    const { config } = useGameConfig()
    const { 
        foods, 
        FOOD_TYPES, 
        createFood, 
        setFoods, 
        updateCurrentLives,
        checkCollision,
        stopAllAnimations
        
    } = useFoods({ config, paused })


    const [characterPosition, setCharacterPosition] = useState(
        config.SCREEN_WIDTH / 2 - config.CHARACTER_WIDTH / 2
    )
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [fallSpeed, setFallSpeed] = useState(config.INITIAL_FALL_SPEED)
    const [gameStarted, setGameStarted] = useState(false)
    const scoreThresholds = useRef([
        20, 40, 70, 100, 150, 200, 300, 400, 500, 600,
    ])
    const foodIdCounter = useRef(0)
    const gameTimer = useRef<NodeJS.Timeout | null>(null)
    const difficultyTimer = useRef<NodeJS.Timeout | null>(null)
    const [difficulty, setDifficulty] = useState(1)
    const [spawnRate, setSpawnRate] = useState(1500)
    const [lifes, setLifes] = useState(3)
    const [coins, setCoins] = useState(0)

    // Adiciona um ref para controlar as colisões já processadas
    const processedCollisions = useRef<Set<number>>(new Set())

    const eatingGoodFood: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/eating_good_food.mp3'))
    const coinSound: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/coin.mp3'))
    const eatingBadFood: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/angry_cat.mp3'))
    const lifeSound: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/lifeSound.mp3'))

    /**
     * inicia o jogo
     * seta todos os estaods e inicia os timers
     */
    const startGame = () => {
        processedCollisions.current.clear()
        setGameStarted(true)
        setGameOver(false)
        setScore(0)
        setFallSpeed(config.INITIAL_FALL_SPEED)
        setDifficulty(1)
        setSpawnRate(1500)
        setFoods([])
        updateCurrentLives(3)
        setLifes(3)
        setPaused(false)

        if (gameTimer.current) clearInterval(gameTimer.current)
        if (difficultyTimer.current) clearInterval(difficultyTimer.current)

        // Inicia o timer de spawn
        gameTimer.current = setInterval(() => {
            if (gameStarted && !gameOver) {
                spawnFood()
            }
        }, 1500)

        // Inicia o timer de dificuldade
        difficultyTimer.current = setInterval(() => {
            if (!gameOver) {
                increaseDifficulty()
            }
        }, 30000)
    }

    /**
     * Finaliza o jogo
     * seta todos os estados e limpa os timers
     */
    const endGame = () => {
        setGameOver(true)
        setGameStarted(false)
        setDifficulty(1)
        setFallSpeed(config.INITIAL_FALL_SPEED)
        setFoods([])
        stopAllAnimations()
        if (gameTimer.current) clearInterval(gameTimer.current)
        if (difficultyTimer.current) clearInterval(difficultyTimer.current)
    }
    /**
     * Pausa o game
     * Para os timers, animações e seta o estado de paused para true
     */
    function pauseGame () {
        setPaused(true)
        stopAllAnimations()

        if(gameTimer.current){
             clearInterval(gameTimer.current)
             gameTimer.current = null
        }
        if(difficultyTimer.current) {
            clearInterval(difficultyTimer.current)
            difficultyTimer.current = null
        }
    }

    function resumeGame() {
        setPaused(false)
        setFoods([])

        if (gameTimer.current) clearInterval(gameTimer.current)
        gameTimer.current = setInterval(() => {
            if (gameStarted && !gameOver && !paused) {
                spawnFood()
            }
        }, 2000)

        if (difficultyTimer.current) clearInterval(difficultyTimer.current)
        difficultyTimer.current = setInterval(() => {
            if (!gameOver && !paused) {
                increaseDifficulty()
            }
        }, 30000)
    }

    /**
     * Aumenta a dificuldade do jhogo
     * aumenta a velocidade das comidas
     */
    const increaseDifficulty = () => {
        setDifficulty((prev) => {
            const newDifficulty = Math.min(prev + 1, 10)

            // Calcula a nova velocidade baseada na dificuldade
            const speedMultiplier = Math.pow(
                config.DIFFICULTY_SPEED_MULTIPLIER,
                newDifficulty
            )
            const newFallSpeed = Math.max(
                config.INITIAL_FALL_SPEED * speedMultiplier,
                config.MIN_FALL_SPEED
            )
            setFallSpeed(newFallSpeed)

            // Calcula a nova taxa de spawn
            const baseSpawnRate = 1500
            const minSpawnRate = 400
            const newSpawnRate = Math.max(
                baseSpawnRate - newDifficulty * 100,
                minSpawnRate
            )

            setSpawnRate(newSpawnRate)

            return newDifficulty
        })
    }

    /**
     * Cria uma nova comida
     */
    const spawnFood = () => {
        if (!gameStarted || gameOver) return

        const createItemParam: NewFood = {
            foodIDCounter: foodIdCounter,
            fallSpeed: fallSpeed,
        }

        // Verifica se pode spawnar mais comidas
        const foodMultiplier =
            1 + difficulty * config.DIFFICULTY_FOOD_MULTIPLIER
        const maxFoods = Math.floor(config.MAX_FOODS_ON_SCREEN * foodMultiplier)

        // Garante que sempre tenha pelo menos uma comida na tela
        if (foods.length === 0 || foods.length < maxFoods) {
            createFood(createItemParam, score)

            // // Spawn de comida extra em níveis mais altos
            if (difficulty > 3) {
                const extraFoodChance = (difficulty - 3) * 15
                if (
                    Math.random() * 100 < extraFoodChance &&
                    foods.length < maxFoods
                ) {
                    setTimeout(() => {
                        if (gameStarted && !gameOver) {
                            createFood(createItemParam, score)
                        }
                    }, 300)
                }
            }
        }
    }

    /**
     * Testa as colisões entre o player e os itens
     * usa callback para não reenderizar o player em casos de não modificar a posição (causava travamentos)
     * @param callback função a ser chamada quando o player come uma comida
     */
    const checkCollisions = useCallback(
        (callback: (type: string) => void) => {
            foods.forEach((food) => {
                // Verifica se a colisão já foi processada
                if (processedCollisions.current.has(food.id)) return

                if (checkCollision(food.id, characterPosition, config.CHARACTER_WIDTH)) {
                    // Marca a colisão como processada
                    processedCollisions.current.add(food.id)

                    // Remove a comida
                    setFoods((prevFoods) =>
                        prevFoods.filter((f) => f.id !== food.id)
                    )

                    // Processa o efeito da colisão
                    if (food.type === 'bad') {
                        setLifes((prevLifes) => {
                            const newLifes = prevLifes - 1
                            updateCurrentLives(newLifes)
                            if (newLifes <= 0) {
                                endGame()
                            }
                            return newLifes
                        })
                        eatingBadFood.seekTo(0)
                        eatingBadFood.play()
                    } else if (food.type === 'health') {
                        setLifes((prevLifes) => {
                            const newLifes = Math.min(prevLifes + 1, 3)
                            updateCurrentLives(newLifes)
                            if (prevLifes + 1 <= 3) {
                                lifeSound.seekTo(0)
                                lifeSound.play()
                            }
                            return newLifes
                        })
                    } else if (food.type === 'coin') {
                        setCoins((prevCoins) => prevCoins + 1)
                        coinSound.seekTo(0)
                        coinSound.play()
                    } else if (food.type === 'good') {
                        setScore((prevScore) => prevScore + food.points)
                        eatingGoodFood.seekTo(0)
                        eatingGoodFood.play()
                    }
                }
            })
        },
        [characterPosition, foods]
    )

    // Adiciona um intervalo de verificação de colisões com frequência reduzida
    useEffect(() => {
        if (gameStarted && !gameOver && !paused) {
            const collisionInterval = setInterval(() => {
                checkCollisions(() => {})
            }, 100) // Reduzido para 10fps para evitar múltiplas detecções

            return () => clearInterval(collisionInterval)
        }
    }, [gameStarted, gameOver, checkCollisions])

    /**
     * Resta os timers no reoload
     */
    useEffect(() => {
        return () => {
            if(gameStarted && !gameOver && !paused) {
            if (gameTimer.current) clearInterval(gameTimer.current)
            if (difficultyTimer.current) clearInterval(difficultyTimer.current)
        }
        }
    }, [])

    /**
     * Reseta os timers quando a mudança em spawn rate ou inicio/fim de jogo
     */
    useEffect(() => {
        if (gameStarted && !gameOver && !paused) {
            if (gameTimer.current) {
                clearInterval(gameTimer.current)
            }
            gameTimer.current = setInterval(() => {
                spawnFood()
            }, spawnRate)
        }
    }, [gameStarted, gameOver, spawnRate])

    /**
     * Controle para corrigir bug de comidas faltantes
     * Basicamente eu tinha um problema em que paravam de spawnar comidas. este effect evita que a tela nunca fique vazia
     */
    useEffect(() => {
        if(gameStarted && !gameOver && !paused) {
        const checkSpawnInterval = setInterval(() => {
            if (gameStarted && !gameOver && foods.length === 0) {
                spawnFood()
            }
        }, 2000)

        return () => clearInterval(checkSpawnInterval)
        }
    }, [gameStarted, gameOver, foods.length])

    return {
        startGame,
        gameStarted,
        setGameStarted,
        score,
        foods,
        characterPosition,
        setCharacterPosition,
        endGame,
        lifes,
        checkCollisions,
        coins,
        gameOver,
        setGameOver,
        paused,
        setPaused,
        pauseGame,
        resumeGame
    }
}

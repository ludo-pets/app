import { useState, useCallback, useRef, useEffect } from 'react'
import { useGameConfig } from './GameConfig'
import useFoods, { FoodItem, NewFood } from './Foods'
import { Audio, AVPlaybackSource } from 'expo-av'

const eatingGoodFood: AVPlaybackSource = require('@/assets/images/minigames/food-game/eating_good_food.mp3')
const coinSound: AVPlaybackSource = require('@/assets/images/minigames/food-game/coin.mp3')
const eatingBadFood: AVPlaybackSource = require('@/assets/images/minigames/food-game/angry_cat.mp3')
const lifeSound: AVPlaybackSource = require('@/assets/images/minigames/food-game/lifeSound.mp3')

const playSound = async (s: AVPlaybackSource) => {
    const { sound } = await Audio.Sound.createAsync(s, {
        shouldPlay: true,
        isLooping: false,
    })
    await sound.playAsync()
}

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
    cleanup: () => void
}

export const useGameManager = (): GameManagerType => {
    const { config } = useGameConfig()
    const { foods, FOOD_TYPES, createFood, setFoods, updateCurrentLives } =
        useFoods({ config })

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

    /**
     * inicia o jogo
     * seta todos os estaods e inicia os timers
     */
    const startGame = () => {
        setGameStarted(true)
        setGameOver(false)
        setScore(0)
        setFallSpeed(config.INITIAL_FALL_SPEED)
        setDifficulty(1)
        setSpawnRate(1500)
        setFoods([])
        updateCurrentLives(3)
        setLifes(3)

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
        setGameOver(true)
        setGameStarted(false)
        setDifficulty(1)
        setFallSpeed(config.INITIAL_FALL_SPEED)
        setFoods([])
        if (gameTimer.current) clearInterval(gameTimer.current)
        if (difficultyTimer.current) clearInterval(difficultyTimer.current)
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

     const cleanup = useCallback(() => {
        if (gameTimer.current) clearInterval(gameTimer.current);
        if (difficultyTimer.current) clearInterval(difficultyTimer.current);
        setGameStarted(false);
        setGameOver(false);
        setScore(0);
        setFallSpeed(config.INITIAL_FALL_SPEED);
        setDifficulty(1);
        setSpawnRate(1500);
        setFoods([]);
        setLifes(3);
        setCoins(0);
    }, []);


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
            const characterTop =
                config.SCREEN_HEIGHT - config.CHARACTER_HEIGHT - 20
            const characterBottom = config.SCREEN_HEIGHT - 20
            const characterLeft = characterPosition
            const characterRight = characterPosition + config.CHARACTER_WIDTH

            foods.forEach((food: FoodItem) => {
                const foodTop = food.yPos
                const foodBottom = foodTop + config.FOOD_SIZE
                const foodLeft = food.x
                const foodRight = food.x + config.FOOD_SIZE

                // Ignora alimentos fora da tela
                if (foodTop > config.SCREEN_HEIGHT) {
                    return
                }
                const horizontalOverlap =
                    (foodLeft <= characterRight && foodLeft >= characterLeft) ||
                    (foodRight >= characterLeft &&
                        foodRight <= characterRight) ||
                    (foodLeft <= characterLeft && foodRight >= characterRight)

                const verticalOverlap =
                    foodTop <= characterBottom && foodBottom >= characterTop

                if (horizontalOverlap && verticalOverlap) {
                    setFoods((prevFoods) =>
                        prevFoods.filter((f) => f.id !== food.id)
                    )
                    if (food.type === 'bad') {
                        //callback("bad");
                        setLifes((prevLifes) => {
                            const newLifes = prevLifes - 1
                            updateCurrentLives(newLifes)
                            if (newLifes <= 0) {
                                endGame()
                            }
                            return newLifes
                        })
                    }

                    if (food.type === 'health') {
                        setLifes((prevLifes) => {
                            const newLifes = Math.min(prevLifes + 1, 3)
                            updateCurrentLives(newLifes)
                            if (prevLifes + 1 <= 3) {
                                playSound(lifeSound)
                            }
                            return newLifes
                        })
                    }

                    if (food.type === 'coin') {
                        setCoins((prevCoins) => prevCoins + 1)
                        playSound(coinSound)
                    }

                    setScore((prevScore) => {
                        const newScore = prevScore + food.points
                        if (food.type === 'good') {
                            playSound(eatingGoodFood)
                        } else if (food.type === 'bad') {
                            playSound(eatingBadFood)
                        }

                        const nextThresholdIndex =
                            scoreThresholds.current.findIndex(
                                (threshold) =>
                                    newScore >= threshold &&
                                    prevScore < threshold
                            )

                        if (nextThresholdIndex !== -1) {
                            increaseDifficulty()
                        }

                        return newScore
                    })
                }
            })
        },
        [
            characterPosition,
            foods,
            config,
            setFoods,
            setLifes,
            setScore,
            increaseDifficulty,
        ]
    )

    /**
     * Resta os timers no reoload
     */
    useEffect(() => {
        return () => {
            if (gameTimer.current) clearInterval(gameTimer.current)
            if (difficultyTimer.current) clearInterval(difficultyTimer.current)
        }
    }, [])

    /**
     * Reseta os timers quando a mudança em spawn rate ou inicio/fim de jogo
     */
    useEffect(() => {
        if (gameStarted && !gameOver) {
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
        const checkSpawnInterval = setInterval(() => {
            if (gameStarted && !gameOver && foods.length === 0) {
                spawnFood()
            }
        }, 2000)

        return () => clearInterval(checkSpawnInterval)
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
        cleanup,
    }
}

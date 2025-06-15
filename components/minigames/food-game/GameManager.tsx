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

    const pausedRef = useRef(paused)
    const gameStartedRef = useRef(gameStarted)
    const gameOverRef = useRef(gameOver)

    useEffect(() => { pausedRef.current = paused }, [paused])
    useEffect(() => { gameStartedRef.current = gameStarted }, [gameStarted])
    useEffect(() => { gameOverRef.current = gameOver }, [gameOver])

    const processedCollisions = useRef<Set<number>>(new Set())

    const eatingGoodFood: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/eating_good_food.mp3'))
    const coinSound: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/coin.mp3'))
    const eatingBadFood: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/angry_cat.mp3'))
    const lifeSound: AudioPlayer = useAudioPlayer(require('@/assets/images/minigames/food-game/lifeSound.mp3'))

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
    }

    const endGame = () => {
        setGameOver(true)
        setGameStarted(false)
        setDifficulty(1)
        setFallSpeed(config.INITIAL_FALL_SPEED)
        setFoods([])
        stopAllAnimations()
        clearTimers()
    }

    const clearTimers = () => {
        if (gameTimer.current) {
            clearInterval(gameTimer.current)
            gameTimer.current = null
        }
        if (difficultyTimer.current) {
            clearInterval(difficultyTimer.current)
            difficultyTimer.current = null
        }
    }

    const createOrResetTimers = (intervalSpawnRate: number) => {
    setTimeout(() => {
        gameTimer.current = setInterval(() => {
            if (
                gameStartedRef.current &&
                !gameOverRef.current &&
                !pausedRef.current
            ) {
                spawnFood()
            }
        }, intervalSpawnRate)
    }, intervalSpawnRate)
}

    function pauseGame () {
        setPaused(true)
        stopAllAnimations()
        clearTimers()
    }

    function resumeGame() {
        setPaused(false)
        setFoods([])

        clearTimers()
        createOrResetTimers(spawnRate)

    }

    const increaseDifficulty = () => {
        setDifficulty((prev) => {
            const newDifficulty = Math.min(prev + 1, 10)

            const speedMultiplier = Math.pow(
                config.DIFFICULTY_SPEED_MULTIPLIER,
                newDifficulty
            )
            const newFallSpeed = Math.max(
                config.INITIAL_FALL_SPEED * speedMultiplier,
                config.MIN_FALL_SPEED
            )
            setFallSpeed(newFallSpeed)

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

    const spawnFood = () => {
        if (!gameStartedRef.current || gameOverRef.current) return

        const createItemParam: NewFood = {
            foodIDCounter: foodIdCounter,
            fallSpeed: fallSpeed,
        }

        const foodMultiplier =
            1 + difficulty * config.DIFFICULTY_FOOD_MULTIPLIER
        const maxFoods = Math.floor(config.MAX_FOODS_ON_SCREEN * foodMultiplier)

        if (foods.length === 0 || foods.length < maxFoods) {
            createFood(createItemParam, score)

            if (difficulty > 3) {
                const extraFoodChance = (difficulty - 3) * 15
                if (
                    Math.random() * 100 < extraFoodChance &&
                    foods.length < maxFoods
                ) {
                    setTimeout(() => {
                        if (gameStartedRef.current && !gameOverRef.current) {
                            createFood(createItemParam, score)
                        }
                    }, 300)
                }
            }
        }
    }

    const checkCollisions = useCallback(
        (callback: (type: string) => void) => {
            foods.forEach((food) => {
                if (processedCollisions.current.has(food.id)) return

                if (checkCollision(food.id, characterPosition, config.CHARACTER_WIDTH)) {
                    processedCollisions.current.add(food.id)

                    setFoods((prevFoods) =>
                        prevFoods.filter((f) => f.id !== food.id)
                    )

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

    useEffect(() => {
        if (gameStarted && !gameOver && !paused) {
            const collisionInterval = setInterval(() => {
                checkCollisions(() => {})
            }, 100)

            return () => clearInterval(collisionInterval)
        }
    }, [gameStarted, gameOver, checkCollisions, paused])

    useEffect(() => {
        return () => {
            clearTimers()
        }
    }, [])

    useEffect(() => {
        if (gameStarted && !gameOver && !paused) {
            clearTimers()
            createOrResetTimers(spawnRate)
        }
    }, [spawnRate, gameStarted, gameOver, paused])

    useEffect(() => {
        if (gameStarted && !gameOver && !paused) {
            const checkSpawnInterval = setInterval(() => {
                if (foods.length === 0) {
                    spawnFood()
                }
            }, spawnRate)

            return () => clearInterval(checkSpawnInterval)
        }
    }, [foods.length, gameStarted, gameOver, paused, spawnRate])

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

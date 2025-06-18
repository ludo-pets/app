import { useState, useRef, useEffect } from 'react'
import { Animated, ImageSourcePropType } from 'react-native'
import { GameConfigType } from './GameConfig'
import { Pause } from 'phosphor-react-native'

const bolo = require('@/assets/images/minigames/food-game/bolo.png')
const chocolate = require('@/assets/images/minigames/food-game/chocolate.png')
const racao = require('@/assets/images/minigames/food-game/racao.png')
const health = require('@/assets/images/minigames/food-game/heart.png')
const coinIcon = require('@/assets/images/profile/pet_coin.png')

const FOOD_TYPES = [
    { type: 'bad', image: bolo, points: 0 },
    { type: 'bad', image: chocolate, points: 0 },
    { type: 'good', image: racao, points: 10 },
    { type: 'health', image: health, points: 0 },
    { type: 'coin', image: coinIcon, points: 0 },
]

export interface FoodItem {
    id: number
    x: number
    y: Animated.Value
    type: string
    image: ImageSourcePropType
    points: number
    currentY: number
}

export interface NewFood {
    foodIDCounter: React.MutableRefObject<number>
    fallSpeed: number
}

interface FoodsProps {
    config: GameConfigType
    paused: boolean
}

interface GetNextFoodTypeParams {
    lives: number
    hasLifeOnScreen: boolean
    coinsOnScreen: number
    score: number
    foodTypes: typeof FOOD_TYPES
    maxCoinsOnScreen?: number
    baseCoinChance?: number
    maxCoinChance?: number
    lifeChanceValue?: number
}

/**
 * Essa função controla que tipo de comida vai spawnar na tela
 * As vidas só podem spawnar se o jogador tiver menos de 3 vidas
 * As moedas tem uma tacha de spawn progressiva, que aumenta a cada 100 pontos do jogador
 * A comidas boas tem 30% de chace de spawnar enquanto as ruin tem 70%
 * @param lives quantidade de vidas do jogador
 * @param hasLifeOnScreen se já existe uma vida na tela
 * @param coinsOnScreen quantidade de moedas na tela
 * @param score pontuação atual do jogador
 * @param foodTypes tipos de comida disponíveis
 * @param maxCoinsOnScreen quantidade máxima de moedas na tela
 * @param baseCoinChance chance base de spawn de moeda
 * @param maxCoinChance chance máxima de spawn de moeda
 * @param lifeChanceValue chance de spawn de vida
 * @returns
 */
function getNextFoodType({
    lives,
    hasLifeOnScreen,
    coinsOnScreen,
    score,
    foodTypes,
    maxCoinsOnScreen = 2,
    baseCoinChance = 0.02,
    maxCoinChance = 0.1,
    lifeChanceValue = 0.2,
}: GetNextFoodTypeParams) {
    // Faixa de vida: 20% se pode
    const canSpawnLife = lives < 3 && !hasLifeOnScreen
    const lifeChance = canSpawnLife ? lifeChanceValue : 0
    // Faixa de moeda: progressiva
    const canSpawnCoin = coinsOnScreen < maxCoinsOnScreen
    const progressiveCoinChance = Math.min(
        baseCoinChance + score / 100,
        maxCoinChance
    )
    const coinChance = canSpawnCoin ? progressiveCoinChance : 0

    const sorteio = Math.random()
    if (sorteio < lifeChance) {
        return foodTypes.find((food) => food.type === 'health')
    } else if (sorteio < lifeChance + coinChance) {
        return foodTypes.find((food) => food.type === 'coin')
    } else {
        // Sorteia entre todos os tipos normais (good/bad) com peso maior para bad
        const badWeight = 0.7 // 70% de chance de bad
        const sorteioTipo = Math.random() < badWeight ? 'bad' : 'good'
        const candidates = foodTypes.filter((food) => food.type === sorteioTipo)
        const idx = Math.floor(Math.random() * candidates.length)
        return candidates[idx]
    }
}

const HUD_HEIGHT = 50

export default function useFoods({ config, paused }: FoodsProps) {
    const [foods, setFoods] = useState<FoodItem[]>([])
    const foodsRef = useRef<FoodItem[]>([])
    const currentLivesRef = useRef(3)
    const animationRefs = useRef<{[key: number]: Animated.CompositeAnimation}>({})
    const positionListeners = useRef<{[key: number]: { remove: () => void }}>({})

    useEffect(() => {
        foodsRef.current = foods
    }, [foods])

    const updateCurrentLives = (lives: number) => {
        currentLivesRef.current = lives
    }

    const createFood = (data: NewFood, score: number) => {
        if(paused) return;
        const randomX = Math.random() * (config.SCREEN_WIDTH - config.FOOD_SIZE)

        const hasLifeOnScreen = foodsRef.current.some((food) => food.type === 'health')
        const coinsOnScreen = foodsRef.current.filter((f) => f.type === 'coin').length
        const lives = currentLivesRef.current

        const foodType = getNextFoodType({
            lives,
            hasLifeOnScreen,
            coinsOnScreen,
            score,
            foodTypes: FOOD_TYPES,
            maxCoinsOnScreen: 1,
        })

        const newFood: FoodItem = {
            id: data.foodIDCounter.current++,
            x: randomX,
            y: new Animated.Value(HUD_HEIGHT),
            type: foodType!.type,
            image: foodType!.image,
            points: foodType!.points,
            currentY: HUD_HEIGHT,
        }

        setFoods(prevFoods => [...prevFoods, newFood])

        // Create and store the animation
        const animation = Animated.timing(newFood.y, {
            toValue: config.SCREEN_HEIGHT,
            duration: data.fallSpeed,
            useNativeDriver: true,
        })

        animationRefs.current[newFood.id] = animation

        // Add listener to track position
        const listener = newFood.y.addListener(({ value }) => {
            setFoods(prevFoods => 
                prevFoods.map(food => {
                    if (food.id === newFood.id) {
                        return {
                            ...food,
                            currentY: value
                        }
                    }
                    return food
                })
            )
        })

        positionListeners.current[newFood.id] = {
            remove: () => newFood.y.removeListener(listener)
        }

        animation.start(({ finished }) => {
            if (finished) {
                positionListeners.current[newFood.id]?.remove()
                delete positionListeners.current[newFood.id]
                setFoods(prevFoods => prevFoods.filter(food => food.id !== newFood.id))
                delete animationRefs.current[newFood.id]
            }
        })
    }

    // Function to check collisions using currentY
    const checkCollision = (foodId: number, characterPosition: number, characterWidth: number): boolean => {
        const food = foodsRef.current.find(f => f.id === foodId)
        if (!food) return false

        const foodY = food.currentY
        const foodSize = config.FOOD_SIZE
        const characterTop = config.SCREEN_HEIGHT - config.CHARACTER_HEIGHT - 20
        const characterBottom = config.SCREEN_HEIGHT - 20

        // Check if food is at character height with tolerance
        const verticalOverlap = foodY + foodSize >= characterTop && foodY <= characterBottom

        if (!verticalOverlap) return false

        // Check horizontal collision with tolerance
        const foodLeft = food.x
        const foodRight = food.x + foodSize
        const characterLeft = characterPosition
        const characterRight = characterPosition + characterWidth

        // Add small tolerance for collision
        const tolerance = 5
        return (
            (foodLeft - tolerance <= characterRight && foodLeft + tolerance >= characterLeft) ||
            (foodRight + tolerance >= characterLeft && foodRight - tolerance <= characterRight) ||
            (foodLeft - tolerance <= characterLeft && foodRight + tolerance >= characterRight)
        )
    }

    // Function to stop all animations
    const stopAllAnimations = () => {
        Object.values(animationRefs.current).forEach(animation => {
            animation.stop()
        })
        Object.values(positionListeners.current).forEach(listener => {
            listener.remove()
        })
        animationRefs.current = {}
        positionListeners.current = {}
    }

    return { 
        foods, 
        FOOD_TYPES, 
        createFood, 
        setFoods, 
        updateCurrentLives,
        checkCollision,
        stopAllAnimations
    }
}

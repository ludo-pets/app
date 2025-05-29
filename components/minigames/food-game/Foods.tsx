import { useState, useRef } from 'react'
import { Animated, ImageSourcePropType } from 'react-native'
import { GameConfigType } from './GameConfig'

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
    yPos: number
    type: string
    image: ImageSourcePropType
    points: number
}

export interface NewFood {
    foodIDCounter: React.MutableRefObject<number>
    fallSpeed: number
}

interface FoodsProps {
    config: GameConfigType
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

export default function useFoods({ config }: FoodsProps) {
    const [foods, setFoods] = useState<FoodItem[]>([])
    const currentLivesRef = useRef(3)

    const updateCurrentLives = (lives: number) => {
        currentLivesRef.current = lives
    }

    /**
     * Cria uma nova comida na tela, considerando a taxa de spawn de cada tipo
     * @param data objeto com id e velocidade da animação dessa comida (o manager é o resposável por aumentar essa velocidade conforme a dificuldade)
     * @param score score do player, usamos para saber a taxa de spawn de moedas
     */
    const createFood = (data: NewFood, score: number) => {
        const randomX = Math.random() * (config.SCREEN_WIDTH - config.FOOD_SIZE)

        const hasLifeOnScreen = foods.some((food) => food.type === 'health')
        const coinsOnScreen = foods.filter((f) => f.type === 'coin').length
        const lives = currentLivesRef.current

        const foodType = getNextFoodType({
            lives,
            hasLifeOnScreen,
            coinsOnScreen,
            score,
            foodTypes: FOOD_TYPES,
            maxCoinsOnScreen: 1, // Nunca spawna moeda se já houver uma
        })

        const newFood: FoodItem = {
            id: data.foodIDCounter.current++,
            x: randomX,
            yPos: HUD_HEIGHT,
            y: new Animated.Value(HUD_HEIGHT),
            type: foodType!.type,
            image: foodType!.image,
            points: foodType!.points,
        }

        setFoods((prevFoods) => [...prevFoods, newFood])

        /**
         * Importante: Esse listener é o que nos permite sempre atualizar o Y e verificar colisões em cada food
         */
        newFood.y.addListener(({ value }) => {
            setFoods((prevFoods) =>
                prevFoods.map((food) =>
                    food.id === newFood.id ? { ...food, yPos: value } : food
                )
            )
        })

        Animated.timing(newFood.y, {
            toValue: config.SCREEN_HEIGHT,
            duration: data.fallSpeed,
            useNativeDriver: false,
        }).start(() => {
            setFoods((prevFoods) =>
                prevFoods.filter((food) => food.id !== newFood.id)
            )
        })
    }

    return { foods, FOOD_TYPES, createFood, setFoods, updateCurrentLives }
}

import { useState } from "react"
import { Animated, ImageSourcePropType } from "react-native"
import { GameConfigType } from "../GameConfig"

const bolo = require("../../../../assets/images/food-game/bolo.png")
const chocolate = require("../../../../assets/images/food-game/chocolate.png")
const racao = require("../../../../assets/images/food-game/racao.png")

const FOOD_TYPES = [
  { type: "bad", image: bolo, points: 0 },
  { type: "bad", image: chocolate, points: 0 },
  { type: "good", image: racao, points: 10 },
]

export interface FoodItem {
  id: number
  x: number
  y: Animated.Value
  yPos : number
  type: string
  image: ImageSourcePropType
  points: number
}

export interface NewFood{
  foodIDCounter : React.MutableRefObject<number> 
  fallSpeed : number 
}

interface FoodsProps{
  config: GameConfigType
}

export default function useFoods({config} : FoodsProps){
  const [foods, setFoods] = useState<FoodItem[]>([])

  //Cria uma nova comida na tela
  const createFood = (data : NewFood) => {
    const randomX = Math.random() * (config.SCREEN_WIDTH - config.FOOD_SIZE) //pega x aleatório pra comida
    const randomFoodIndex = Math.floor(Math.random() * FOOD_TYPES.length)    //Escolhe uma comida aleatória
    const foodType = FOOD_TYPES[randomFoodIndex]                             //Pega a comida com o indice gerado
    
    //Cria comida
    const newFood: FoodItem = {
      id: data.foodIDCounter.current++,
      x: randomX,
      yPos: 0,
      y: new Animated.Value(0),
      type: foodType.type,
      image: foodType.image,
      points: foodType.points,
    }
    
    //Adiciona na lista
    setFoods((prevFoods) => [...prevFoods, newFood])

    // Importante: primeiro configuramos o listener antes de adicionar à lista
    newFood.y.addListener(({ value }) => {
      // Atualizamos o estado inteiro para garantir que o React detecte a mudança
      setFoods((prevFoods) => prevFoods.map((food) => (food.id === newFood.id ? { ...food, yPos: value } : food)))
    })
    
    // Anima a comida caindo
    Animated.timing(newFood.y, {
      toValue: config.SCREEN_HEIGHT,
      duration: data.fallSpeed,
      useNativeDriver: false,
    }).start(() => {
      //esse start é enganoso, ele executa quando a animação termina
      setFoods((prevFoods) => prevFoods.filter((food) => food.id !== newFood.id))
    })
  }

  return {foods, FOOD_TYPES, createFood, setFoods}
}
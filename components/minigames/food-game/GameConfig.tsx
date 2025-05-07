import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export interface GameConfigType  {
    SCREEN_WIDTH: number
    SCREEN_HEIGHT: number
    SPEED: number
    INITIAL_FALL_SPEED: number
    CHARACTER_WIDTH: number
    CHARACTER_HEIGHT:number
    FOOD_SIZE: number
    MIN_FALL_SPEED: number
    MAX_FOODS_ON_SCREEN: number
    DIFFICULTY_SPEED_MULTIPLIER: number
    DIFFICULTY_FOOD_MULTIPLIER: number
    PROB_COIN_SPAWN: number
}

function generateDefaultGame() : GameConfigType  {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height - 60 - 80;
    
    // Calcula o número máximo de comidas baseado na largura da tela
    const maxFoodsOnScreen = Math.floor(screenWidth / 70); // Uma comida a cada 70 pixels
    
    return {
        SCREEN_WIDTH: screenWidth,
        SCREEN_HEIGHT: screenHeight,
        SPEED: 1000,
        INITIAL_FALL_SPEED: 4000, // Começa mais rápido
        CHARACTER_WIDTH: 70,
        CHARACTER_HEIGHT: 70,
        FOOD_SIZE: 50,
        MIN_FALL_SPEED: 1500, // Velocidade máxima
        MAX_FOODS_ON_SCREEN: maxFoodsOnScreen,
        DIFFICULTY_SPEED_MULTIPLIER: 0.95, // Redução mais suave da velocidade
        DIFFICULTY_FOOD_MULTIPLIER: 0.15, // Aumento de quantidade de comidas
        PROB_COIN_SPAWN: 0.1, // 10% de chance de spawnar moeda, aumenta conforme a dificuldade
    }
}

export function useGameConfig() {
  const [config, setConfig] = useState<GameConfigType>(generateDefaultGame);
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setConfig(prevConfig => ({
        ...prevConfig,
        SCREEN_WIDTH: window.width,
        SCREEN_HEIGHT: window.height,
      }));
    });

    return () => subscription.remove();
  }, []);

  const updateConfig = (newConfig : GameConfigType) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig,
    }));
  };

  return { config, updateConfig };
}

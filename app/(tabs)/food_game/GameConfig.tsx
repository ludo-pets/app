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
}

function generateDefaultGame() : GameConfigType  {
    return {
        SCREEN_WIDTH: Dimensions.get('window').width,
        SCREEN_HEIGHT: Dimensions.get('window').height,
        SPEED: 1000,
        INITIAL_FALL_SPEED: 3000,
        CHARACTER_WIDTH: 80,
        CHARACTER_HEIGHT: 80,
        FOOD_SIZE: 70,
        MIN_FALL_SPEED: 1000,    
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
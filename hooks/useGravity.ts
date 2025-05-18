import { useEffect, useRef, MutableRefObject } from "react";
import { Animated } from "react-native";

interface GravityProps {
  prevValuePositionY: MutableRefObject<number>;
  gravity: number;
  positionYPet: Animated.Value;
  gameOver: boolean;
}

export function useGravity({
  prevValuePositionY,
  gravity,
  positionYPet,
  gameOver,
}: GravityProps) {
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (gameOver) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      return;
    }
    const updatePetPosition = () => {
        if (prevValuePositionY.current == null) return;

      const newPosition = prevValuePositionY.current + gravity;
      positionYPet.setValue(newPosition);
      prevValuePositionY.current = newPosition;
      animationFrame.current = requestAnimationFrame(updatePetPosition);
    };
    animationFrame.current = requestAnimationFrame(updatePetPosition);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [gravity, gameOver]);
}
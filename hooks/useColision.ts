import { useEffect, useState } from "react";
import { Animated } from "react-native";

interface UseCollisionProps {
  positionXObstacles: Animated.Value;
  positionYPet: Animated.Value;
  obstacleDimensions: {
    heightObstacleTop: number;
    heightObstacleBottom: number;
  };
  windowHeight: number;
  petWidth: number;
  petHeight: number;
  obstacleWidth: number;
  heightFloor: number;
}

export function useColision({
  positionXObstacles,
  positionYPet,
  obstacleDimensions,
  windowHeight,
  petWidth,
  petHeight,
  obstacleWidth,
  heightFloor,
}: UseCollisionProps) {
  const [isColliding, setIsColliding] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const checkCollision = () => {
      const posX = (positionXObstacles as any).__getValue();
      const posY = (positionYPet as any).__getValue();

      const isHorizontallyAligned = posX < petWidth && posX + obstacleWidth > 0;

      const centerY = windowHeight / 2;
      const petTop = posY;
      const petBottom = posY + petHeight;

      const topLimit = -centerY + obstacleDimensions.heightObstacleTop;
      const bottomLimit =
        centerY - heightFloor - obstacleDimensions.heightObstacleBottom;

      const isCollidingVertically =
        petTop < topLimit || petBottom > bottomLimit;

      const isOutOfBounds =
        petTop < -centerY || petBottom > centerY - heightFloor;

      if ((isHorizontallyAligned && isCollidingVertically) || isOutOfBounds) {
        // setIsColliding(true);
        return;
      }

      animationFrameId = requestAnimationFrame(checkCollision);
    };

    animationFrameId = requestAnimationFrame(checkCollision);

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    positionXObstacles,
    positionYPet,
    obstacleDimensions,
    windowHeight,
    petWidth,
    petHeight,
    obstacleWidth,
    heightFloor,
  ]);

  return isColliding;
}
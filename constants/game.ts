import { Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const gameConstants = {
  initialGravity: 1,
  flyUpStrength: -8,
  flyDownStrength: 8,
  heightSpace: 250, // Espaço entre os obstáculos
  heightFloor: 100, // Altura do chão
  initialDuration: 3000,
  airPlaneDegree: -30,
  airPlaneDegreeDown: -40,
  airPlaneDegreeUp: 40,
  airPlaneDegreeDuration: 100,
  initialDimensions: {
    width: 50,
    height: 50,
    positionX: windowWidth,
    positionY: -windowHeight / 2,
  },
  petWidth: 40,
  petHeight: 40,
  obstacleWidth: 65,
};
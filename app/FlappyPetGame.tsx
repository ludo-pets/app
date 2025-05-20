import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  Animated,
  Pressable,
  Alert,
} from "react-native";

import Pet from "@/components/minigames/flappyPet/Pet";
import Obstacle from "@/components/minigames/flappyPet/Obstacle";
import { useCallback, useEffect, useRef, useState } from "react";
import { gameConstants } from "../constants/game";
import { useObstacleMovement } from "../hooks/useObstacleMovement";
import { useCollision } from "@/hooks/useCollision";
import { useGravity } from "../hooks/useGravity";
import { generateObstacleHeights } from "../utils/generateObstacleHeight";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

interface DimensionsObstacle {
  heightObstacleTop: number;
  heightObstacleBottom: number;
}
export default function FlappyPetGame() {
  // animations
  const positionYPet = useRef(
    new Animated.Value(gameConstants.initialDimensions.positionY)
  ).current;

  const prevValuePositionY = useRef(gameConstants.initialDimensions.positionY);
  const positionXObstacles = useRef(new Animated.Value(windowWidth));
  const airPlaneDegree = useRef(
    new Animated.Value(gameConstants.airPlaneDegree)
  ).current;

  const initialDimensions = generateObstacleHeights(
    windowHeight,
    gameConstants.heightSpace,
    gameConstants.heightFloor
  );

  const [obstacleDimensions, setObstacleDimensions] =
    useState<DimensionsObstacle>(initialDimensions);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gravity, setGravity] = useState(gameConstants.initialGravity);
  const [duration, setDuration] = useState(gameConstants.initialDuration);

  const handlerObstacleHeights = useCallback(() => {
    const newObstacleDimensions = generateObstacleHeights(
      windowHeight,
      gameConstants.heightSpace,
      gameConstants.heightFloor
    );
    setObstacleDimensions(newObstacleDimensions);
  }, [windowHeight]);

  useObstacleMovement({
    positionXObstacles: positionXObstacles.current,
    duration,
    onReset: handlerObstacleHeights,
    windowWidth,
    isGameOver,
  });

  const isColliding = useCollision({
    positionXObstacles: positionXObstacles.current,
    positionYPet,
    obstacleDimensions,
    windowHeight,
    petWidth: gameConstants.petWidth,
    petHeight: gameConstants.petHeight,
    obstacleWidth: gameConstants.obstacleWidth,
    heightFloor: gameConstants.heightFloor,
  });

  useGravity({
    prevValuePositionY,
    gravity,
    positionYPet,
    gameOver: isGameOver,
  });

  useEffect(() => {
    if (isColliding) {
      setIsGameOver(true);
      positionXObstacles.current.stopAnimation();
      positionYPet.stopAnimation();
    }
  }, [isColliding]);

  function handlerFlyDirection(direction: "up" | "down" | "none") {
    // Alert.alert("titulo", "teste up", [
    //   {
    //     text: "OK",
    //     onPress: () => console.log("OK Pressed "),
    //   },
    // ]);
    let gravityStrength = 0;
    switch (direction) {
      case "up":
        gravityStrength = gameConstants.flyUpStrength;
        break;
      case "down":
        gravityStrength = gameConstants.flyDownStrength;
        break;
      case "none":
        gravityStrength = gameConstants.initialGravity;
        break;
    }
    setGravity(gravityStrength);
  }

  function handlerAirPlaneDegree(degree: number) {
    Animated.spring(airPlaneDegree, {
      toValue: degree,
      useNativeDriver: false,
      bounciness: 0,
      speed: 10,
    }).start();
  }

  return (
    <View
      style={[styles.container, { width: windowWidth, height: windowHeight }]}
    >
      <Pressable
        onPressIn={() => {
          handlerFlyDirection("up");
          handlerAirPlaneDegree(gameConstants.airPlaneDegreeUp);
        }}
        onPressOut={() => {
          handlerFlyDirection("none");
          handlerAirPlaneDegree(gameConstants.airPlaneDegree);
        }}
        style={styles.pressFlyUpBox}
      />
      <Pressable
        onPressIn={() => {
          handlerFlyDirection("down");
          handlerAirPlaneDegree(gameConstants.airPlaneDegreeDown);
        }}
        onPressOut={() => {
          handlerFlyDirection("none");
          handlerAirPlaneDegree(gameConstants.airPlaneDegree);
        }}
        style={styles.pressFlyDownBox}
      />
      {/* Fundo do jogo */}
      <ImageBackground
        source={require("../assets/game/background.png")}
        style={styles.gameScnarioContainer}
        resizeMode="cover"
      ></ImageBackground>

      {/* Chão do jogo */}
      <ImageBackground
        source={require("../assets/game/floor.png")}
        style={styles.floor}
        resizeMode="repeat"
      />

      {/* Pet renderizado sobre o fundo */}
      <Pet positionY={positionYPet} airPlaneDegree={airPlaneDegree} />

      {/* Obstáculo renderizado sobre o fundo */}
      <Obstacle
        height={obstacleDimensions.heightObstacleTop}
        isTopObstacle
        positionX={positionXObstacles.current}
      />
      {/* <Obstacle height={10} positionX={positionXObstacles} /> */}
      <Obstacle
        height={obstacleDimensions.heightObstacleBottom}
        positionX={positionXObstacles.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    // backgroundColor: "blue",
  },
  gameScnarioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // height: windowHeight - gameConstants.heightFloor,
    position: "relative",
    zIndex: 1,
    width: "100%",
  },
  floor: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: gameConstants.heightFloor,
    backgroundColor: "blue",
    zIndex: 2,
  },
  pressFlyUpBox: {
    position: "absolute",
    width: "50%",
    height: "100%",
    zIndex: 5,
    right: 0,
  },
  pressFlyDownBox: {
    position: "absolute",
    width: "50%",
    height: "100%",
    zIndex: 5,
    left: 0,
  },
});
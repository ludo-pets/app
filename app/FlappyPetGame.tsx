import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    View,
    Animated,
    Easing,
  } from "react-native";
  import Pet from "../components/minigames/flappyPet/Pet";
  import Obstacle from "../components/minigames/flappyPet/Obstacle";
  import { useEffect, useState, useRef } from "react";
  
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  
  interface dimensions {
    heightObstacleTop: number;
    heightObstacleBottom: number;
  }
  export default function FlappyPetGame() {
    const positionXObstacles = new Animated.Value(windowWidth);
    const duration = 3000;
    const heightSpace = 100; // Espaço entre os obstáculos
    const heightFloor = 100; // Altura do chão
    const [obstacleDimensions, setObstacleDimensions] = useState<dimensions>(
      getObstaclesDimensions(windowHeight, heightSpace, heightFloor)
    );

    const startBottom = windowHeight / 2;
    const petBottom = useRef(new Animated.Value(startBottom)).current;

    useEffect(() => {
      const interval = setInterval(() => {
        petBottom.setValue(petBottom.getValue() - 3);
      }, 30);

      return () => clearInterval(interval);
    }, []);
  
    //console.log("🚀 ~ FlappyPetGame ~ obstacleDimensions:", obstacleDimensions);
  
    useEffect(() => {
      positionXObstacles.setValue(windowWidth);
      Animated.timing(positionXObstacles, {
        toValue: -50,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
  
      const setTimeoutObstacles = setTimeout(() => {
        setObstacleDimensions(
          getObstaclesDimensions(windowHeight, heightSpace, heightFloor)
        );
      }, duration);
  
      return () => {
        clearTimeout(setTimeoutObstacles);
      };
    }, [duration, positionXObstacles]);
  
    function getObstaclesDimensions(
      windowHeight: number,
      heightSpace: number,
      heightFloor: number
    ) {
      const spaceOffset = windowHeight - heightFloor - heightSpace;
      const heightTopObstacle = Math.random() * spaceOffset;
      const heightBottomObstacle = spaceOffset - heightTopObstacle;
  
      return {
        heightObstacleTop: heightTopObstacle,
        heightObstacleBottom: heightBottomObstacle,
      };
    }

    const handleJump = () => {
      Animated.timing(petBottom, {
        toValue: petBottom.getValye() + 60,
        duration: 150,
        useNativeDriver: false,
      }).start();
    };
  
    return (
      <View
        style={[styles.container, { width: windowWidth, height: windowHeight }]}
      >
        {/* Fundo do jogo */}
        <ImageBackground
          source={require("..//assets/images/minigames/flappyPet/game/background.png")}
          style={styles.gameScnarioContainer}
          resizeMode="cover"
        ></ImageBackground>
  
        {/* Chão do jogo */}
        <ImageBackground
          source={require("..//assets/images/minigames/flappyPet/game/floor.png")}
          style={styles.floor}
          resizeMode="repeat"
        />
  
        {/* Pet renderizado sobre o fundo */}
        <Pet petBottom={petBottom}/>
  
        {/* Obstáculo renderizado sobre o fundo */}
        <Obstacle
          height={obstacleDimensions.heightObstacleTop}
          isTopObstacle
          positionX={positionXObstacles}
        />
        {/* <Obstacle height={10} positionX={positionXObstacles} /> */}
        <Obstacle
          height={obstacleDimensions.heightObstacleBottom}
          positionX={positionXObstacles}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      overflow: "hidden",
    },
    gameScnarioContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: windowHeight - 100,
      position: "relative",
      zIndex: 1,
      width: "100%",
    },
    floor: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: 100,
      zIndex: 2,
    },
  });
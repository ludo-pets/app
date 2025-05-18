import { gameConstants } from "@/constants/game";
import { Animated, Text, StyleSheet, Image } from "react-native";

interface PetProps{
    positionY: Animated.Value;
    airPlaneDegree: Animated.Value;
}

export default function Pet({ positionY, airPlaneDegree}: PetProps) {
    const interpolatedAirPlaneDegree = airPlaneDegree.interpolate({
        inputRange: [
            gameConstants.airPlaneDegreeDown,
            gameConstants.airPlaneDegreeUp,
        ],
        outputRange: [
          `${gameConstants.airPlaneDegreeUp}deg`,
          `${gameConstants.airPlaneDegreeDown}deg`,
        ],
        extrapolate: "clamp",
    });

    return (
    <Animated.View
      style={[
        styles.petContainer,
        {
          transform: [
            { translateY: positionY },
            { rotate: interpolatedAirPlaneDegree },
          ],
        },
      ]}
    >
      <Image
        style={styles.pet}
        source={require("@/assets/images/minigames/flappyPet/game/pet4.png")}
        resizeMode="contain"
      />
      <Image
        style={styles.airPlane}
        source={require("@/assets/images/minigames/flappyPet/game/airPlane.png")}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  petContainer: {
    width: gameConstants.petWidth,
    height: gameConstants.petHeight,
    minHeight: 80,
    minWidth: 80,
    position: "absolute",
    bottom: 100,
    left: 50,
    zIndex: 4,
  },
  pet: {
    width: "80%",
    height: "80%",
    position: "absolute",
    bottom: "30%",
    left: "10%",
    zIndex: 4,
    transform: [{ scaleX: -1 }, { rotate: "25deg" }],
  },

  airPlane: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    transform: [{ scaleX: -1 }],
  },
});


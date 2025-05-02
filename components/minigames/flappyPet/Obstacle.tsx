import { StyleSheet, Animated, Dimensions, Easing } from "react-native";

const { height: windowHeight} = Dimensions.get("window")

interface ObstacleProps {
    height: number;
    positionX: Animated.Value;
    isTopObstacle?: boolean;
}

export default function Obstacle({
    height,
    isTopObstacle,
    positionX,
}: ObstacleProps) {
    const topPosition = isTopObstacle ? 0 : windowHeight - height - 100;
    return (
        <Animated.View
        style={[
          styles.obstacle,
          { height, transform: [{ translateX: positionX }], top: topPosition },
        ]}
      />
    );
  }

const styles = StyleSheet.create({
    obstacle: {
        position: "absolute",
        width: 50,
        backgroundColor:"green",
        bottom: 100,
        zIndex: 3,
    },
});
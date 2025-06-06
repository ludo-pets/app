import { Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { useCellSize } from "../../../hooks/minigames/pets2048/useCellSize";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  ZoomOut,
  ZoomIn,
} from "react-native-reanimated";
import {
  ANIMATION_DURATION,
  CELL_COLORS,
  CELL_NUMBER_COLORS,
  CELL_NUMBER_FONT_SIZE,
  MARGIN,
  theme,
  TILE_BACKGROUND_COLOR,
  TILE_IMAGES,
} from "../../../constants/minigames/Pets2048";

interface Props {
  x: number;
  y: number;
  value: number;
}

const Cell = ({ x, y, value }: Props) => {
  const cellWidth = useCellSize();
  const prevValue = useRef(value);
  const scaleUp = useSharedValue(false);

  const getCellPosition = (x: number, y: number) => {
    return {
      top: 2 * MARGIN + x * (cellWidth + 2 * MARGIN),
      left: 2 * MARGIN + y * (cellWidth + 2 * MARGIN),
    };
  };

  const top = useSharedValue(getCellPosition(x, y).top);
  const left = useSharedValue(getCellPosition(x, y).left);

  useEffect(() => {
    const position = getCellPosition(x, y);
    top.value = position.top;
    left.value = position.left;
  }, [x, y]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: withTiming(top.value, { duration: ANIMATION_DURATION }),
      left: withTiming(left.value, { duration: ANIMATION_DURATION }),
      transform: [
        {
          scale: withTiming(
            scaleUp.value ? 1.1 : 1,
            {
              duration: ANIMATION_DURATION,
            },
            (finished) => {
              if (finished) {
                scaleUp.value = false;
              }
            }
          ),
        },
      ],
    };
  });

  if (prevValue.current !== value) {
    scaleUp.value = true;
    prevValue.current = value;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: cellWidth,
          height: cellWidth,
          backgroundColor: CELL_COLORS[value],
        },
        animatedStyles,
      ]}
      entering={ZoomIn.duration(ANIMATION_DURATION)}
      exiting={ZoomOut.duration(ANIMATION_DURATION)}
    >
      <Image
        source={TILE_IMAGES[value]}
        style={{ width: "80%", height: "80%", resizeMode: "contain" }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cell;

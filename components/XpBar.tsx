import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";

interface xpBarProps {
  xp: number;
  level: number;
};

const XpBar = ({ xp, level }: xpBarProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Calculate the XP bar size based on the level
  const xpBarSize = 95 + level * 5;

  const barWidth = animatedValue.interpolate({
    inputRange: [0, xpBarSize],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: xp,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [xp, animatedValue]);

  return (
    <View style={styles.container}>
      <View style={styles.pawContainer}>
        <Image source={require("../assets/images/paw-xp-bar.png")} />
        <Text style={styles.levelText}>{level}</Text>
      </View>
      <View style={styles.bar}>
        <Text style={styles.text}>{xp}/{xpBarSize}</Text>
        <View style={styles.barBackground}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  pawContainer: {
    position: "relative",
    marginRight: 10,
  },
  levelText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -5 }, { translateY: -3.4 }],
    fontSize: 14,
    fontWeight: "bold",
    color: "#5B5B5B",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-end",
    color: "#5B5B5B",
  },
  bar: {
    width: "82%",
  },
  barBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#80BEE7",
  },
});

export default XpBar;

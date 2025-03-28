import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";

const XpBar = () => {
  const [xp, setXp] = useState(0); 
  const animatedValue = useRef(new Animated.Value(0)).current;

  
  const barWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/images/paw-xp-bar.png')}/>
      <View style={styles.bar}>
        <Text style={styles.text}>{xp}/100</Text>
        <View style={styles.barBackground}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    marginHorizontal: "auto",
  },
  img: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-end",
  },
  bar: {
    width: 270
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

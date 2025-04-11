import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const XpBar = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const xpBarSize = 95 + level * 5;

  const barWidth = animatedValue.interpolate({
    inputRange: [0, xpBarSize],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (!user || !user.email) {
          console.warn();
          return;
        }
  
        const db = getFirestore();
        const userDocRef = doc(db, "User", user.email); 
        const userSnapshot = await getDoc(userDocRef);
  
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setXp(userData.experience || 0);
          setLevel(userData.level || 1);
          animatedValue.setValue(userData.experience || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
  
    fetchUserData();
  }, []);
  

  useEffect(() => {
    if (xp >= xpBarSize) {
      setLevel((prev) => prev + 1);
      setXp(0);
      animatedValue.setValue(0);
    }
  }, [xp]);

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
    alignItems: "center",
    alignContent: "center"
  },
  pawContainer: {
    position: "relative", 
    marginRight: 30,
    marginLeft: 10
  },
  levelText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -4 }, { translateY: -3.4 }],
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
    width: 260,
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

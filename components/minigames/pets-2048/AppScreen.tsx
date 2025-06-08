import { View, Text, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Board from "./Board";
import { theme } from "../../../constants/minigames/Pets2048";

const AppScreen = () => {
  const [resetKey, setResetKey] = useState(0);

  const handleNewGame = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>2048 Pets</Text>
      </View>
      {/* Score is now handled inside Board */}
      <Board resetKey={resetKey} />
      <View style={styles.footer}>
        <Button title="Novo Jogo" onPress={handleNewGame} color="#E8A598" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8EF",
    padding: 16,
    paddingTop: 48,
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 64,
    fontWeight: "900",
    color: "#E8A598",
    fontFamily: theme.fonts.regular,
  },
  footer: {
    marginBottom: 48,
  },
});

export default AppScreen;

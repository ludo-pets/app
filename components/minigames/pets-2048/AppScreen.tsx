import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Board from "./Board";
import { theme } from "../../../constants/minigames/Pets2048";

const AppScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>2048 Cats</Text>
        <Text style={styles.subtitle}>
          Uma versão fofa do clássico 2048!{"\n"}Em vez de números, combine
          gatinhos para desbloquear felinos raros e divertidos.
        </Text>
      </View>
      <Board />
      <View style={styles.footer}>
        <Text style={styles.bold}>Instruções</Text>
        <Text style={styles.subtitle}>
          Deslize para mover as peças. {"\n"}
          Combine dois gatos iguais para criar um novo. {"\n"}Continue juntando
          para ver quantos gatos você consegue desbloquear!
        </Text>
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
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    fontSize: 18,
    color: theme.textPrimary,
    fontWeight: "400",
    fontFamily: theme.fonts.regular,
  },
  bold: {
    fontSize: 18,
    color: theme.textPrimary,
    fontWeight: "700",
    fontFamily: theme.fonts.bold,
  },
  footer: {
    marginBottom: 48,
  },
});

export default AppScreen;

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  backgroundColor?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({
  title,
  backgroundColor = "#fff",
  showBackButton = false,
  onBackPress,
}: HeaderProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

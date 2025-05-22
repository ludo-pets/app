import { Coordinate } from "@/dtos/GestureEventType";
import { StyleSheet, Text } from "react-native";

function getRandomFruitEmoji() {
  const fruitEmojis = ["@", "*"];
  const randomIndex = Math.floor(Math.random() * fruitEmojis.length);
  return fruitEmojis[randomIndex];
}

export default function Food({ x, y}: Coordinate): JSX.Element {
  return <Text style={[{ top: y * 10, left: x * 10}, styles.food]}>@</Text>;
}

const styles = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    borderRadius: 7,
    position: "absolute",
  },
})
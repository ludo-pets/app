import { Direction } from "@/dtos/GestureEventType";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen"

const DOG_INITIAL_POSITION = [{ x: 5, y: 5}];
const FOOD_INITIAL_POSITION = {x: 5, y: 20};
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 63};
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game(): JSX.Element {

    const [direction, setDirection] = React.useState<Direction>(Direction.Right)

    const handleGesture = (event: any) => {
        const { translationX, translationY } = event.nativeEvent;

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {

            } else {

            } 
        } else {
            if (translationY > 0) {
        }
        }
    };
    return(
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}></SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    }
})

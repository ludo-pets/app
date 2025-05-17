import { Coordinate, Direction } from "@/dtos/GestureEventType";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen"
import Dog from "./Dog";

const DOG_INITIAL_POSITION = [{ x: 5, y: 5}];
const FOOD_INITIAL_POSITION = {x: 5, y: 20};
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 63};
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game(): JSX.Element {

    const [direction, setDirection] = React.useState<Direction>(Direction.Right)
    const [dog, setDog] = React.useState<Coordinate[]>(
        DOG_INITIAL_POSITION
    );
    const [food, setFood] = React.useState<Coordinate>(
        FOOD_INITIAL_POSITION
    );
    const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);

    const moveDog = () => {
        const dogHead = dog[0];
        const newHead = {...dogHead}
    }

    const handleGesture = (event: any) => {
        const { translationX, translationY } = event.nativeEvent;

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {
                setDirection(Direction.Right);
            } else {
                setDirection(Direction.Left)
            } 
        } else {
            if (translationY > 0) {
                setDirection(Direction.Down)
        } else {
            setDirection(Direction.Up)
        }
        }
    };
    return(
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
                <View style={styles.boundaries}>
                    <Dog dog={dog} />
                </View>
            </SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    boundaries: {
        flex: 1,
        borderColor: Colors.primary,
        borderWidth: 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: Colors.backgroud,
    }
})

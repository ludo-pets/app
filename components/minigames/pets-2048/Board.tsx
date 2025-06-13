import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import {
    BOARD_SIZE,
    BOARD_WIDTH_MULTIPLIER,
    MARGIN,
    theme,
} from '../../../constants/minigames/Pets2048'
import BackgroundCell from './BackgroundCell'
import { useGame, Direction } from '../../../hooks/minigames/pets2048/useGame'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

import Cell from './Cell'
import GameOverScreen from './GameOverScreen'

const Board = ({ resetKey }: { resetKey: number }) => {
    const { width } = useWindowDimensions()
    const backgroundCells = useMemo(() => {
        return new Array(BOARD_SIZE * BOARD_SIZE)
            .fill(0)
            .map((_, index) => <BackgroundCell key={index.toString()} />)
    }, [])

    // Now get score from useGame
    const { logBoard, board, move, startGame, gameOver, score } = useGame()

    useEffect(() => {
        startGame()
    }, [resetKey])

    const flingGesture = Gesture.Pan().onEnd((e) => {
        if (gameOver) {
            return
        }
        const absX = Math.abs(e.translationX)
        const absY = Math.abs(e.translationY)
        let direction: Direction
        if (absX < absY) {
            direction = e.translationY < 0 ? 'up' : 'down'
        } else {
            direction = e.translationX < 0 ? 'left' : 'right'
        }
        runOnJS(move)(direction)
    })

    logBoard()

    const cells = board.map(({ x, y, value, id }) => (
        <Cell x={x} y={y} value={value} key={id} />
    ))

    return (
        <>
            <View style={styles.arrange}>
                <View style={styles.backgroundScore}>
                    <Text style={styles.score}>Score: {score}</Text>
                </View>
                {gameOver && <GameOverScreen onTryAgain={startGame} />}
                <GestureDetector gesture={flingGesture}>
                    <View
                        style={[
                            styles.container,
                            {
                                width: width * BOARD_WIDTH_MULTIPLIER,
                                height: width * BOARD_WIDTH_MULTIPLIER,
                            },
                        ]}
                    >
                        {backgroundCells}
                        {cells}
                    </View>
                </GestureDetector>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    arrange: {},
    container: {
        backgroundColor: theme.backgroundSecondary,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: MARGIN,
        position: 'relative',
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E8A598',
    },
    backgroundScore: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginBottom: 16,
    },
})

export default Board

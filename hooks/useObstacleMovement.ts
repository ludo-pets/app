import { useEffect } from 'react'
import { Animated, Easing } from 'react-native'

interface ObstacleMovementProps {
    positionXObstacles: Animated.Value
    duration: number
    onReset: () => void
    windowWidth: number
    isGameOver: boolean
}
export function useObstacleMovement({
    positionXObstacles,
    duration,
    windowWidth,
    onReset,
    isGameOver,
}: ObstacleMovementProps) {
    useEffect(() => {
        let isCanceled = false
        if (isGameOver) {
            positionXObstacles.stopAnimation()
            return
        }
        const runAnimation = () => {
            Animated.sequence([
                Animated.timing(positionXObstacles, {
                    toValue: -60,
                    duration,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.timing(positionXObstacles, {
                    toValue: windowWidth,
                    duration: 0,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
            ]).start(() => {
                if (!isCanceled && !isGameOver) {
                    onReset()
                    runAnimation()
                }
            })
        }
        runAnimation()
        return () => {
            isCanceled = true
            positionXObstacles.stopAnimation()
        }
    }, [duration, onReset, positionXObstacles, windowWidth, isGameOver])
}

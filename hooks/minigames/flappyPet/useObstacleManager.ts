import { gameConstants } from '@/constants/minigames/flappyPet/game'
import { generateObstacleHeights } from '@/utils/minigames/flappyPet/generateObstacleHeight'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing } from 'react-native'
import useGameManager from './useGameManager'

export interface DimensionsObstacle {
    heightObstacleTop: number
    heightObstacleBottom: number
}
export default function useObstacleManager(
    gameOver: boolean,
    isPaused: boolean
) {
    const { width: windowWidth, height: windowHeight } =
        Dimensions.get('window')

    const initialDimensions = generateObstacleHeights(
        windowHeight,
        gameConstants.heightSpace,
        gameConstants.heightFloor
    )

    const positionXObstacles = useRef(new Animated.Value(windowWidth)).current
    const [speed, setSpeed] = useState(gameConstants.initialSpeed)
    const [obstacleDimensions, setObstacleDimensions] =
        useState<DimensionsObstacle>(initialDimensions)

    const gameManager = useGameManager()
    const handleObstacleReset = useCallback(() => {
        const newObstacleDimensions = generateObstacleHeights(
            windowHeight,
            gameConstants.heightSpace,
            gameConstants.heightFloor
        )
        setObstacleDimensions(newObstacleDimensions)
        gameManager.incrementScore()

        setSpeed((prevSpeed) => {
            const newSpeed = prevSpeed + prevSpeed * 0.05
            return Math.min(newSpeed, 500)
        })
    }, [windowHeight])

    useEffect(() => {
        let isCanceled = false
        const currentXObstacules = (positionXObstacles as any).__getValue()

        const distance = Math.abs(
            currentXObstacules - gameConstants.targertObstacules
        )
        const durationAnimation = (distance / speed) * 1000

        const runAnimation = () => {
            if (gameOver || isPaused || isCanceled) {
                positionXObstacles.stopAnimation()
                return
            }

            Animated.timing(positionXObstacles, {
                toValue: -80,
                duration: durationAnimation,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start(({ finished }) => {
                if (!finished || gameOver || isPaused || isCanceled) {
                    return
                }

                positionXObstacles.setValue(windowWidth)
                handleObstacleReset()
                runAnimation()
            })
        }

        runAnimation()

        return () => {
            isCanceled = true
            positionXObstacles.stopAnimation()
        }
    }, [
        speed,
        handleObstacleReset,
        positionXObstacles,
        windowWidth,
        gameOver,
        isPaused,
    ])

    return {
        positionXObstacles,
        obstacleDimensions,
        handleObstacleReset,
        score: gameManager.score,
        coins: gameManager.coins,
        speed,
    }
}

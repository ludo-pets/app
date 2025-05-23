import { gameConstants } from '@/constants/game'
import { generateObstacleHeights } from '@/utils/minigames/flappyPet/generateObstacleHeight'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing } from 'react-native'

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
    const [duration, setDuration] = useState(gameConstants.initialDuration)
    const [obstacleDimensions, setObstacleDimensions] =
        useState<DimensionsObstacle>(initialDimensions)
    // console.log('🚀 ~ obstacleDimensions:', obstacleDimensions)
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)

    const handleObstacleReset = useCallback(() => {
        console.log('🚀 ~ trocoooou')
        const newObstacleDimensions = generateObstacleHeights(
            windowHeight,
            gameConstants.heightSpace,
            gameConstants.heightFloor
        )
        setObstacleDimensions(newObstacleDimensions)
        setScore((prevScore) => {
            if (prevScore % 5 === 0 && prevScore > 0) {
                setCoins((prevCoins) => prevCoins + 1)
            }
            return prevScore + 1
        })

        setDuration((prevDuration) => {
            const newDuration = prevDuration * 0.98
            return Math.max(newDuration, 1500)
        })
    }, [windowHeight])

    useEffect(() => {
        let isCanceled = false

        const runAnimation = () => {
            if (gameOver || isPaused || isCanceled) {
                positionXObstacles.stopAnimation()
                return
            }

            Animated.timing(positionXObstacles, {
                toValue: -80,
                duration,
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
        duration,
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
        score,
        coins,
        duration,
    }
}

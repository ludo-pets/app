import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    View,
    Animated,
    Pressable,
    ActivityIndicator,
} from 'react-native'

import Pet from '@/components/minigames/flappyPet/Pet'
import Obstacle from '@/components/minigames/flappyPet/Obstacle'
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { gameConstants } from '@/constants/game'
import { useObstacleMovement } from '@/hooks/useObstacleMovement'
import { useCollision } from '@/hooks/useCollision'
import { useGravity } from '@/hooks/useGravity'
import { generateObstacleHeights } from '@/utils/generateObstacleHeight'
import { useNavigation } from 'expo-router'
import Score from '@/components/minigames/flappyPet/Score'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

interface DimensionsObstacle {
    heightObstacleTop: number
    heightObstacleBottom: number
}
export default function Renderer() {
    //esconder taskbar
    const navigation = useNavigation()
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        })

        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: undefined,
            })
        }
    }, [navigation])

    //imagens
    const background = require('@/assets/images/minigames/flappyPet/background.png')
    const floor = require('@/assets/images/minigames/flappyPet/floor.png')

    //Positions and values
    const positionYPet = useRef(
        new Animated.Value(gameConstants.initialDimensions.positionY)
    ).current
    const prevValuePositionY = useRef(gameConstants.initialDimensions.positionY)
    const positionXObstacles = useRef(new Animated.Value(windowWidth)).current
    const airPlaneDegree = useRef(
        new Animated.Value(gameConstants.airPlaneDegree)
    ).current

    //initial values
    const initialDimensions = generateObstacleHeights(
        windowHeight,
        gameConstants.heightSpace,
        gameConstants.heightFloor
    )

    //states
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [obstacleDimensions, setObstacleDimensions] =
        useState<DimensionsObstacle>(initialDimensions)
    const [isGameOver, setIsGameOver] = useState(false)
    const [gravity, setGravity] = useState(gameConstants.initialGravity)
    const [duration, setDuration] = useState(gameConstants.initialDuration)

    // handlers
    function handlerFlyDirection(direction: 'up' | 'down' | 'none') {
        let gravityStrength = 0
        switch (direction) {
            case 'up':
                gravityStrength = gameConstants.flyUpStrength
                break
            case 'down':
                gravityStrength = gameConstants.flyDownStrength
                break
            case 'none':
                gravityStrength = gameConstants.initialGravity
                break
        }
        setGravity(gravityStrength)
    }
    function handlerAirPlaneDegree(degree: number) {
        Animated.spring(airPlaneDegree, {
            toValue: degree,
            useNativeDriver: false,
            bounciness: 0,
            speed: 10,
        }).start()
    }
    const handleObstacleReset = useCallback(() => {
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

    // minigame physics in hooks. viniii :)
    useObstacleMovement({
        positionXObstacles: positionXObstacles,
        duration,
        onReset: handleObstacleReset,
        windowWidth,
        isGameOver,
    })

    useGravity({
        prevValuePositionY,
        gravity,
        positionYPet,
        gameOver: isGameOver,
    })

    const isColliding = useCollision({
        positionXObstacles: positionXObstacles,
        positionYPet,
        obstacleDimensions,
        windowHeight,
        petWidth: gameConstants.petWidth,
        petHeight: gameConstants.petHeight,
        obstacleWidth: gameConstants.obstacleWidth,
        heightFloor: gameConstants.heightFloor,
    })

    //use effects
    useEffect(() => {
        if (isColliding) {
            setIsGameOver(true)
            positionXObstacles.stopAnimation()
            positionYPet.stopAnimation()
        }
    }, [isColliding])

    return (
        <View
            style={[
                styles.container,
                { width: windowWidth, height: windowHeight },
            ]}
        >
            <Score score={score} coins={coins} />
            <Pressable
                onPressIn={() => {
                    handlerFlyDirection('up')
                    handlerAirPlaneDegree(gameConstants.airPlaneDegreeUp)
                }}
                onPressOut={() => {
                    handlerFlyDirection('none')
                    handlerAirPlaneDegree(gameConstants.airPlaneDegree)
                }}
                style={styles.pressFlyUpBox}
            />
            <Pressable
                onPressIn={() => {
                    handlerFlyDirection('down')
                    handlerAirPlaneDegree(gameConstants.airPlaneDegreeDown)
                }}
                onPressOut={() => {
                    handlerFlyDirection('none')
                    handlerAirPlaneDegree(gameConstants.airPlaneDegree)
                }}
                style={styles.pressFlyDownBox}
            />
            {/* Fundo do jogo */}
            <ImageBackground
                source={background}
                style={styles.gameScnarioContainer}
                resizeMode="cover"
            ></ImageBackground>

            {/* Chão do jogo */}
            <ImageBackground
                source={floor}
                style={styles.floor}
                resizeMode="repeat"
            />

            {/* Pet renderizado sobre o fundo */}
            <Pet positionY={positionYPet} airPlaneDegree={airPlaneDegree} />

            {/* Obstáculos renderizado sobre o fundo */}
            <Obstacle
                height={obstacleDimensions.heightObstacleTop}
                isTopObstacle
                positionX={positionXObstacles}
            />
            <Obstacle
                height={obstacleDimensions.heightObstacleBottom}
                positionX={positionXObstacles}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
    },
    gameScnarioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // height: windowHeight - gameConstants.heightFloor,
        position: 'relative',
        zIndex: 1,
        width: '100%',
    },
    floor: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: gameConstants.heightFloor,
        backgroundColor: 'blue',
        zIndex: 2,
    },
    pressFlyUpBox: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        zIndex: 5,
        right: 0,
    },
    pressFlyDownBox: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        zIndex: 5,
        left: 0,
    },
})

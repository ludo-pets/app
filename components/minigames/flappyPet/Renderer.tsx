import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    View,
    Pressable,
    Animated,
    Easing,
} from 'react-native'

import Pet from '@/components/minigames/flappyPet/Pet'
import Obstacle from '@/components/minigames/flappyPet/Obstacle'
import { useEffect } from 'react'
import { gameConstants } from '@/constants/minigames/flappyPet/game'
import Score from '@/components/minigames/flappyPet/Score'
import useObstacleManager from '@/hooks/minigames/flappyPet/useObstacleManager'
import useGamePhysics from '@/hooks/minigames/flappyPet/useGamePhysics'
import useCollisionDetection from '@/hooks/minigames/flappyPet/useCollisionDetection'
import useGameManager from '@/hooks/minigames/flappyPet/useGameManager'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

export default function Renderer() {
    //imagens
    const background = require('@/assets/images/minigames/flappyPet/background.png')
    const floor = require('@/assets/images/minigames/flappyPet/floor.png')

    const gameManager = useGameManager()

    const { positionXObstacles, obstacleDimensions, score, coins } =
        useObstacleManager()

    const {
        positionYPet,
        airPlaneDegree,
        handleFlyDirection,
        handleAirPlaneDegree,
    } = useGamePhysics()

    const isColliding = useCollisionDetection({
        positionYPet,
        obstacleDimensions,
        positionXObstacles,
    })

    //use effects
    useEffect(() => {
        if (!isColliding) return
        gameManager.setGameOver(true)
        gameManager.setFallingAnimation(true)

        setTimeout(() => {
            Animated.timing(positionYPet, {
                toValue: windowHeight - gameConstants.heightFloor,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start(() => {})
        }, 100)
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
                    handleFlyDirection('up')
                    handleAirPlaneDegree(gameConstants.airPlaneDegreeUp)
                }}
                onPressOut={() => {
                    handleFlyDirection('none')
                    handleAirPlaneDegree(gameConstants.airPlaneDegree)
                }}
                style={styles.pressFlyUpBox}
            />
            <Pressable
                onPressIn={() => {
                    handleFlyDirection('down')
                    handleAirPlaneDegree(gameConstants.airPlaneDegreeDown)
                }}
                onPressOut={() => {
                    handleFlyDirection('none')
                    handleAirPlaneDegree(gameConstants.airPlaneDegree)
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
        position: 'relative',
        zIndex: 1,
        width: '100%',
    },
    floor: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: gameConstants.heightFloor,
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

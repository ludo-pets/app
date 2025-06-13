import { StyleSheet, Animated, Dimensions, Easing, Image } from 'react-native'
import { gameConstants } from '@/constants/minigames/flappyPet/game'

const { height: windowHeight } = Dimensions.get('window')

interface ObstacleProps {
    height: number
    positionX: Animated.Value
    isTopObstacle?: boolean
}

export default function Obstacle({
    height,
    isTopObstacle,
    positionX,
}: ObstacleProps) {
    //images
    const pipeTop = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/flappyPet/flappyPet/pipe_top.png',
    }
    const pipeCore = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/flappyPet/flappyPet/pipe_core.png',
    }

    const topPosition = isTopObstacle ? 0 : windowHeight - height - 100
    const flexDirection = isTopObstacle ? 'column-reverse' : 'column'
    return (
        <Animated.View
            style={[
                styles.obstacle,
                {
                    ...(isTopObstacle ? { height } : {}),
                    transform: [{ translateX: positionX }],
                    top: topPosition,
                    flexDirection,
                },
            ]}
        >
            <Image source={pipeTop} style={styles.pipeTop} />
            <Image source={pipeCore} style={styles.pipeCore} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    obstacle: {
        position: 'absolute',
        width: gameConstants.obstacleWidth,
        bottom: 100,
        zIndex: 3,
        alignItems: 'center',
        flex: 1,
    },
    pipeCore: {
        flex: 1,
        width: '85%',
        resizeMode: 'repeat',
        height: '80%',
    },
    pipeTop: {
        zIndex: 1,
        width: '100%',
        height: 28,
        resizeMode: 'cover',
    },
})

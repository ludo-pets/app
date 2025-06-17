import Renderer from '@/components/minigames/flappyPet/Renderer'
import StartGameDialog from '@/components/minigames/flappyPet/StatGameDialog'
import EndGameDialog from '@/components/minigames/flappyPet/EndGameDialog'
import { router, useNavigation } from 'expo-router'
import { useState } from 'react'
import useGameManager from '@/hooks/minigames/flappyPet/useGameManager'
import { View } from 'react-native'

export default function GameFlow() {
    // images
    // const imageIconPause = require('@/assets/images/minigames/flappyPet/pauseIcon.png')
    // const imageIconPlay = require('@/assets/images/minigames/flappyPet/playIcon.png')

    const gameManager = useGameManager()

    const [gameKey, setGameKey] = useState(0)


    function handleContinue() {
        gameManager.resetGame()
        setGameKey((prev) => prev + 1)
        router.push('/home')
    }

    function handleStartGame() {
        gameManager.setGameIdle(false)
    }

    function togglePause() {
        gameManager.setGameIdle(!gameManager.isGameIdle)
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Botão de Pause/Play */}
            {/* {!gameManager.isGameOver && (
                <Pressable
                    style={styles.containerPauseButton}
                    onPress={togglePause}
                >
                    <Image
                        style={styles.imgPauseButton}
                        source={
                            gameManager.isGameIdle
                                ? imageIconPlay
                                : imageIconPause
                        }
                    />
                </Pressable>
            )} */}

            {gameManager.isGameIdle && !gameManager.isGameOver && (
                <StartGameDialog startGame={handleStartGame} />
            )}

            {!gameManager.isGameIdle && gameManager.isGameOver && (
                <EndGameDialog
                    coins={gameManager.coins}
                    score={gameManager.score}
                    callback={handleContinue}
                />
            )}

            <Renderer key={gameKey} isPaused={gameManager.isGameIdle} />
        </View>
    )
}

// const styles = StyleSheet.create({
//     containerPauseButton: {
//         position: 'absolute',
//         top: 20,
//         right: 20,
//         width: 50,
//         height: 50,
//         zIndex: 4,
//         backgroundColor: '#fff',
//         borderRadius: 25,
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//     },
//     imgPauseButton: {
//         width: '100%',
//         height: '100%',
//     },
// })

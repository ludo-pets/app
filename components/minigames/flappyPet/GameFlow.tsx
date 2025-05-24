import Renderer from '@/components/minigames/flappyPet/Renderer'
import StartGameDialog from '@/components/minigames/flappyPet/StatGameDialog'
import EndGameDialog from '@/components/minigames/flappyPet/EndGameDialog'
import { router, useNavigation } from 'expo-router'
import { useLayoutEffect, useState } from 'react'
import useGameManager from '@/hooks/minigames/flappyPet/useGameManager'
import { View } from 'react-native'

export default function GameFlow() {
    const gameManager = useGameManager()
    const navigation = useNavigation()

    const [gameKey, setGameKey] = useState(0)

    // Esconde a tabbar
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

    function handleContinue() {
        gameManager.resetGame()
        setGameKey((prev) => prev + 1)
        router.push('/home')
    }

    function handleStartGame() {
        gameManager.setGameIdle(false)
    }

    return (
        <View style={{ flex: 1 }}>
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

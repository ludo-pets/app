import Renderer from '@/components/minigames/flappyPet/Renderer'
import StartGameDialog from '@/components/minigames/flappyPet/StatGameDialog'
import EndGameDialog from '@/components/minigames/flappyPet/EndGameDialog'
import { router } from 'expo-router'
import { useState } from 'react'
import useGameManager from '@/hooks/minigames/flappyPet/useGameManager'
import { View } from 'react-native'
import { checkAchievementMinigameFirstTime } from '@/utils/AchievementHelper'
import { useConfirmExit } from '@/hooks/usePreventNavigationExit'
import ConfirmExitModal from '@/components/ConfirmExitModal'

export default function GameFlow() {
    const gameManager = useGameManager()
    function onResume() {
        gameManager.setGameIdle(false)
        setGamePaused(false)
    }

    function onPause() {
        gameManager.setGameIdle(true)
        setGamePaused(true)
    }

    const { modalVisible, onConfirm, onCancel } = useConfirmExit({
        onResume,
        onPause,
    })

    const [gameKey, setGameKey] = useState(0)
    const [gamePaused, setGamePaused] = useState(false)

    function handleContinue() {
        gameManager.resetGame()
        setGameKey((prev) => prev + 1)
        checkAchievementMinigameFirstTime("Olha o aviãozinho!")
        router.push('/home')
    }

    function handleStartGame() {
        gameManager.setGameIdle(false)
    }

    return (
        <View style={{ flex: 1 }}>
            {gameManager.isGameIdle &&
                !gameManager.isGameOver &&
                !gamePaused && <StartGameDialog startGame={handleStartGame} />}

            {!gameManager.isGameIdle && gameManager.isGameOver && (
                <EndGameDialog
                    coins={gameManager.coins}
                    score={gameManager.score}
                    callback={handleContinue}
                />
            )}

            <ConfirmExitModal
                visible={modalVisible}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />

            <Renderer key={gameKey} />
        </View>
    )
}

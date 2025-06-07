import { View, StatusBar, StyleSheet } from 'react-native'
import { useGameManager } from '../../../components/minigames/food-game/GameManager'
import Renderer from '../../../components/minigames/food-game/Renderer'
import StarterGameDialog from '../../../components/minigames/food-game/StarterGameDialog'
import React from 'react'
import EndGameDialog from '../../../components/minigames/food-game/EndGameDialog'
import { useRouter } from 'expo-router'
import { useConfirmExit } from '@/hooks/usePreventNavigationExit'
import ConfirmExitModal from '@/components/ConfirmExitModal'


const FoodGame = () => {
    const gameManager = useGameManager()
    const router = useRouter()

    const handleContinue = () => {
        gameManager.setGameOver(false)
        router.push('/home')
    }

    
      const { modalVisible, onConfirm, onCancel } = useConfirmExit()

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {!gameManager.gameStarted && !gameManager.gameOver && (
                <StarterGameDialog startGame={gameManager.startGame} />
            )}

            {!gameManager.gameStarted && gameManager.gameOver && (
                <EndGameDialog
                    callback={handleContinue}
                    score={gameManager.score}
                    coins={gameManager.coins}
                />
            )}
            <ConfirmExitModal
                      visible={modalVisible}
                      onConfirm={onConfirm}
                      onCancel={onCancel}
                    />

            <Renderer gameManager={gameManager} />
        </View>
    )
}

export default FoodGame

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
        width: '100%',
    },
})

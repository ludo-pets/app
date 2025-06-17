import { View, StatusBar, StyleSheet } from 'react-native'
import { useGameManager } from '@/components/minigames/food-game/GameManager'
import Renderer from '@/components/minigames/food-game/Renderer'
import StarterGameDialog from '@/components/minigames/food-game/StarterGameDialog'
import React from 'react'
import EndGameDialog from '@/components/minigames/food-game/EndGameDialog'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import Header from '@/components/Header'

const FoodGame = () => {
    const gameManager = useGameManager()
    const router = useRouter()

    useFocusEffect(
            React.useCallback(() => {
                return () => {
                    gameManager.cleanup();
                };
            }, [])
        );

    const handleContinue = () => {
        gameManager.setGameOver(false)
        router.push('/home')
    }

    return (
        <View style={styles.container}>
            <Header
                title="Comilança Maluca"
                backgroundColor="#CFE2A8"
                showBackButton
            />
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

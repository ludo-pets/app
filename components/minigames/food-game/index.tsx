import { View, StatusBar, StyleSheet} from "react-native";
import { useGameManager } from "./GameManager"
import Renderer from "./Renderer";
import StarterGameDialog from "./StarterGameDialog";
import React from "react";
import EndGameDialog from "./EndGameDialog";
import { useRouter } from "expo-router";

const FoodGame = () => {
    const gameManager = useGameManager();
    const router = useRouter();

    const handleContinue = () => {
        gameManager.setGameOver(false);
        router.push('/home');
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {
                (!gameManager.gameStarted && !gameManager.gameOver) && (
                    <StarterGameDialog startGame={gameManager.startGame} />
                )
            }

            {
                (!gameManager.gameStarted && gameManager.gameOver) && (
                    <EndGameDialog callback={handleContinue} score={gameManager.score}  coins={gameManager.coins} />
                )
            }
           
            <Renderer gameManager={gameManager} /> 
        </View>
    )
}

export default FoodGame;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87CEEB",
        width: "100%",
    },
});


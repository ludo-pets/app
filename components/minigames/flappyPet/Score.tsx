import { StyleSheet, Text, View } from 'react-native'

interface ScoreProps {
    score: number
    coins: number
}

export default function Score({ score, coins }: ScoreProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.scoreText}>Pontos: {score}</Text>
            <Text style={styles.coinsText}>Moedas: {coins} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    coinsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
})

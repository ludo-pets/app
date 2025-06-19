import GameFlow from '@/components/minigames/flappyPet/GameFlow'
import { GameManagerProvider } from '@/contexts/minigames/flappyPet/GameManagerProvider'
import Header from '@/components/Header'
import { View, StyleSheet } from 'react-native'

export default function FlappyPetGame() {
    return (
        <View style={styles.container}>
            <Header
                title="Flappy Pet"
                backgroundColor="#CFE2A8"
                showBackButton
            />
            <GameManagerProvider>
                <GameFlow />
            </GameManagerProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

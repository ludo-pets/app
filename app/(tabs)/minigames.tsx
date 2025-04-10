import NailTrimGame from '@/components/minigames/nail-trim-game'
import { StyleSheet, View } from 'react-native'

export default function MinigameScreen() {
    return (
        <>
            <View style={styles.container}>
              <NailTrimGame />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})

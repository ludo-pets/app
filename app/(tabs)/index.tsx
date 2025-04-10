import MoodBar from '@/components/MoodBar'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    return (
        <>
            <View style={styles.container}>
                <MoodBar animalLevel={2} animalMood={70} />
                <Text style={styles.title}>Home</Text>
                <View style={styles.separator} />
                <View style={styles.separator} />
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

import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <MoodBar animalLevel={2} animalMood={70} />
            <Homescreen/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    }
})

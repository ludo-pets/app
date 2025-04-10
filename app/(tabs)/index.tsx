import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { useUserPetStore } from '@/stores/ludoStore'
import { StyleSheet, View } from 'react-native'

export default function HomeScreen() {
    const user = useUserPetStore((state) => state.user)
    return (
        <View style={styles.container}>
            <MoodBar animalLevel={user?.level} animalMood={70} />
            <Homescreen />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
})

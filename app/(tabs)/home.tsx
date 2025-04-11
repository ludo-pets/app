import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { useUserPetStore } from '@/stores/userPetStore'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

export default function HomeScreen() {
    const user = useUserPetStore((state) => state.user)
    const loading = useUserPetStore((state) => state.loading)
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#5b5b5b" />
            ) : (
                <>
                    <MoodBar
                        animalLevel={user?.level}
                        animalMood={100}
                    />
                    <Homescreen />
                </>
            )}
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

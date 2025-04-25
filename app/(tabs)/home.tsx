import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { useUserPetStore } from '@/stores/userPetStore'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { calcPetMood } from '@/utils/moodCalculator'
import { useEffect, useState } from 'react'

export default function HomeScreen() {
    const user = useUserPetStore((state) => state.user)
    const loading = useUserPetStore((state) => state.loading)
    const pet = useUserPetStore((state) => state.pet)
    const [mood, setMood] = useState(0);
    useEffect(() => {
        if (pet) {
            console.log(pet);
            setMood(calcPetMood(pet.wellBeing))
        }
    }, [pet]
    )

    console.log(mood)


    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#5b5b5b" />
            ) : (
                <>
                    <MoodBar animalLevel={user?.level} animalMood={mood} />
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


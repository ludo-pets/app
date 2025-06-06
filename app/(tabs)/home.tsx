import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native'
import Dialog from '@/components/Dialog/Dialog'

import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'
import { useEffect, useState } from 'react'
import type { Mood } from '@/utils/moodCalculator'

export default function HomeScreen() {
    const user = useUserPetStore((state) => state.user)
    const loading = useUserPetStore((state) => state.loading)
    const pet = useUserPetStore((state) => state.pet)

    const [mood, setMood] = useState<Mood>()
    
    useEffect(() => {
        if (pet) setMood(calcPetMood(pet.wellBeing))
    }, [pet])

    useEffect(() => {
        if (!walkthroughDone) return
        let cancelled = false
        ;(async () => {
            const flag = await AsyncStorage.getItem(CARE_FLAG)
            if (!cancelled && flag === null) setModal(true)
        })()
        return () => {
            cancelled = true
        }
    }, [walkthroughDone])

    const handleStart = async () => {
        await AsyncStorage.setItem(CARE_FLAG, 'true')
        setModal(false)
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#5b5b5b" />
            ) : (
                <>
                    <MoodBar animalLevel={user?.level} animalMood={mood?.mood ?? 0} />
                    <Homescreen />
                </>
            )}

            <PetCareModal
                visible={showModal}
                onStart={handleStart}
                onDismiss={() => setModal(false)}
            />
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

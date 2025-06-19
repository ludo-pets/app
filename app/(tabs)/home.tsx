import React, { useEffect, useState, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'
import type { Mood } from '@/utils/moodCalculator'
import PetCareModal from '@/components/PetCareDialog'
import { useWalkthrough } from '@/contexts/WalkthroughContext'

const CARE_FLAG = 'appCareFlagModal_v0'

export default function HomeScreen() {
    const user = useUserPetStore((s) => s.user)
    const loading = useUserPetStore((s) => s.loading)
    const pet = useUserPetStore((s) => s.pet)

    const [mood, setMood] = useState<Mood>()
    const [showModal, setShowModal] = useState(false)
    const [ready, setReady] = useState(false)

    const { isCompleted } = useWalkthrough()

    useEffect(() => {
        if (pet) setMood(calcPetMood(pet.wellBeing))
    }, [pet])

    useEffect(() => {
        if (!isCompleted) return

        let cancelled = false
        ;(async () => {
            try {
                const flag = await AsyncStorage.getItem(CARE_FLAG)
                if (!cancelled && flag !== 'true') setShowModal(true)
            } finally {
                if (!cancelled) setReady(true)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [isCompleted])

    const persistFlag = useCallback(async () => {
        try {
            await AsyncStorage.setItem(CARE_FLAG, 'true')
        } catch (err) {
            console.error('Failed to persist care flag', err)
        }
    }, [])

    const handleStart = useCallback(async () => {
        await persistFlag()
        setShowModal(false)
    }, [persistFlag])

    const handleDismiss = useCallback(async () => {
        await persistFlag()
        setShowModal(false)
    }, [persistFlag])

    if (!ready) return null

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#5b5b5b" />
            ) : (
                <>
                    <MoodBar
                        animalLevel={user?.level}
                        animalMood={mood?.mood ?? 0}
                    />
                    <Homescreen />
                </>
            )}

            <PetCareModal
                visible={showModal}
                onStart={handleStart}
                onDismiss={handleDismiss}
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

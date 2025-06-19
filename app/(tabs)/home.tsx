import React, { useEffect, useState, useCallback } from 'react'
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'
import type { Mood } from '@/utils/moodCalculator'
import PetCareModal from '@/components/PetCareDialog'
import { useWalkthrough } from '@/contexts/WalkthroughContext'

const CARE_FLAG = 'appCareFlagModal_v0'
import { addItem } from '@/services/itemService'

export default function HomeScreen() {
    const { pet, updatePet, user, loading, itemsAdapter } = useUserPetStore()

    const [mood, setMood] = useState<Mood>()
    const [showModal, setShowModal] = useState(false)
    const [ready, setReady] = useState(false)
    const { isCompleted } = useWalkthrough()

    useEffect(() => {
        if (pet) setMood(calcPetMood(pet.wellBeing))
    }, [pet])

    const handlePress = async () => {
        // await addItem()
        // await duplicateDocument()

        //         const defaultItems = [
        //     {
        //         itemId: 'defaultToy',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+4.png',
        //     },
        //     {
        //         itemId: 'defaultBed',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+7.png',
        //     },
        //     {
        //         itemId: 'defaultFood',
        //         quantity: 1000,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+36.png',
        //     },
        //     {
        //         itemId: 'defaultWC',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+21.png',
        //     },
        //     {
        //         itemId: 'defaultFloor',
        //         quantity: 1,
        //         image: '#B6E683',
        //     },
        //     {
        //         itemId: 'defaultWallpaper',
        //         quantity: 1,
        //         image: '#C0DFF3',
        //     },
        //     {
        //         itemId: 'defaultWater',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+41.png',
        //     },
        // ]

        // if (pet) {
        //   const purchasedItems= [
        //       // ...pet.purchasedItems,
        //       ...defaultItems
        //   ]

        //   await updatePet(pet.id, { purchasedItems: purchasedItems })

        //   await updatePet(pet.id, { activeItems: {
        //       toy: 'defaultToy',
        //       bed: 'defaultBed',
        //       food: 'defaultFood',
        //       wc: 'defaultWC',
        //       floor: 'defaultFloor',
        //       wallpaper: 'defaultWallpaper',
        //       water: 'defaultWater',
        //   } })
        // }

        console.log('Item adicionado com sucesso!')
    }

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
            console.log('Failed to persist care flag', err)
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
                    {/* <Pressable onPress={() => handlePress()}>
                        <Text>ADICIONAR ITEM</Text>
                    </Pressable> */}
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

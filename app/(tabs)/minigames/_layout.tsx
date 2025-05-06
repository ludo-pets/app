// minigames/_layout.tsx
import { Stack } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import React from 'react'

export default function MinigameStackLayout() {
    const navigation = useNavigation()
    const router = useRouter()

    React.useEffect(() => {
        const unsub = navigation.addListener('blur', () => {
            router.replace('/minigames')
        })
        return unsub
    }, [navigation, router])

    return (
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="NailTrimGame" />
        </Stack>
    )
}

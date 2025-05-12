import { Stack } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import React from 'react'

export default function MinigameStackLayout() {
    return (
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="NailTrimGame" />
        </Stack>
    )
}

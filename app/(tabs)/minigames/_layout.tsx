import { Stack } from 'expo-router'
import React from 'react'

export default function MinigameStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'none',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="NailTrimGame" />
            <Stack.Screen name="FoodGame" />
        </Stack>
    )
}

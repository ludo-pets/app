import * as React from 'react'
import * as SplashScreen from 'expo-splash-screen'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
    initialRouteName: 'index',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Inter: require('@/assets/fonts/Inter.ttf'),
        ...FontAwesome.font,
    })

    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return <RootLayoutNav />
}

function RootLayoutNav() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="quizSummary" options={{ headerShown: false }} />
                <Stack.Screen
                    name="petCreate"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="quizGame"
                    options={{
                        headerShown: false, // Remove the default header
                    }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaView>
    )
}

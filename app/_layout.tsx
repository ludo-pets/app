import * as React from 'react'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as WebBrowser from 'expo-web-browser'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'

WebBrowser.maybeCompleteAuthSession()
export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

SplashScreen.preventAutoHideAsync().catch(() => {})

type PetNeeds = {
  lastFed: number
  lastDrank: number
  lastSlept: number
  lastCleaned: number
  lastPlayed: number
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    Inter: require('@/assets/fonts/Inter.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {})
  }, [loaded])

  useEffect(() => {
    /* Android channel */
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const interval = setInterval(async () => {
      const petNeeds = await loadPetData()
      if (petNeeds) {
        await checkPetNeedsAndNotify(petNeeds)
      }
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  const loadPetData = async (): Promise<PetNeeds | null> => {
    try {
      const saved = await AsyncStorage.getItem('petNeeds')
      return saved ? JSON.parse(saved) : null
    } catch (err) {
      console.error('Erro ao carregar dados do pet:', err)
      return null
    }
  }

  const checkPetNeedsAndNotify = async (pet: PetNeeds) => {
    const now = Math.floor(Date.now() / 1000)
    const needs = [
      { type: 'comida', last: pet.lastFed, max: 216_000 },
      { type: 'água', last: pet.lastDrank, max: 216_000 },
      { type: 'sono', last: pet.lastSlept, max: 216_000 },
      { type: 'limpeza', last: pet.lastCleaned, max: 432_000 },
      { type: 'brincadeira', last: pet.lastPlayed, max: 43_200 },
    ]

    for (const n of needs) {
      const elapsed = now - n.last
      if (elapsed > n.max) {
        await sendNotification(
          `🐾 Seu pet precisa de ${n.type}!`,
          `Está há ${Math.floor(elapsed / 3600)} horas sem ${n.type}.`,
        )
      }
    }
  }

  const sendNotification = async (title: string, body: string) => {
    if (Platform.OS === 'android' && !Device.isDevice) {
      console.log(`[Notificação Simulada]: ${title} - ${body}`)
      return
    }
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { url: '/pet-care' } },
      trigger: { seconds: 2 },
    })
  }

  if (!loaded) return null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
      <Stack>
        <Stack.Screen name="oauthredirect" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="quizSummary" options={{ headerShown: false }} />
        <Stack.Screen name="petCreate" options={{ headerShown: false }} />
        <Stack.Screen name="quizGame" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
}

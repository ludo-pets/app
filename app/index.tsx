import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as WebBrowser from 'expo-web-browser'
import * as Notifications from 'expo-notifications'

import { auth } from '@/firebaseConfig'
import GoogleSigninButton from '@/components/GoogleSigninComponent'
import { useUserPetStore } from '@/stores/userPetStore'

WebBrowser.maybeCompleteAuthSession()

export default function AuthCheck() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }
  }, [])

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {})

    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const email = user.email!
          const { fetchUserAndPetByEmail } = useUserPetStore.getState()
          await fetchUserAndPetByEmail(email)

          const { pet } = useUserPetStore.getState()

          router.replace(
            pet
              ? '/(tabs)/home'
              : { pathname: '/petCreate', params: { userId: user.uid, email } },
          )
        } else {
          setReady(true)
        }
      } catch (err) {
        console.error('AuthCheck fatal:', err)
        setReady(true)
      } finally {
        SplashScreen.hideAsync().catch(() => {})
      }
    })

    return unsub
  }, [])

  if (!ready) {
    return (
      <View style={styles.containerBox}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.containerBox}>
      <View style={styles.mainContent}>
        <Image
          source={require('@/assets/images/ludopets.png')}
          style={styles.image}
        />

        <View style={styles.buttons}>
          <GoogleSigninButton />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    paddingHorizontal: 17,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FEFEFE',
  },
  link: {
    fontSize: 16,
    fontWeight: '300',
    color: '#5B5B5B',
    textDecorationLine: 'underline',
  },
  mainContent: {
    height: '100%',
    width: '100%',
    maxHeight: 650,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 256,
    height: 256,
    borderRadius: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 80,
  },
})

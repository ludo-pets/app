import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
    initializeAuth,
    getReactNativePersistence,
    getAuth,
    GoogleAuthProvider,
} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth =
    Platform.OS === 'web'
        ? getAuth(firebaseApp)
        : initializeAuth(firebaseApp, {
              persistence: getReactNativePersistence(ReactNativeAsyncStorage),
          })

const provider = new GoogleAuthProvider()

export { firebaseApp, db, auth, provider }

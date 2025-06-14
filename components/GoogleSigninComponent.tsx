import React, { useEffect } from 'react'
import { Text, StyleSheet, Pressable, Image, Platform } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import {
    createUserService,
    getUserWithPetByIdService,
} from '@/services/userService'
import { useRouter } from 'expo-router'
import { useUserPetStore } from '@/stores/userPetStore'
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google'

const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
})

export default function GoogleSigninButton() {
    const router = useRouter()
    const [request, response, promptAsync] = useIdTokenAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        expoClientId: process.env.EXPO_PUBLIC_EXPO_CLIENT_ID,
        redirectUri,
    })

    useEffect(() => {
        const authenticate = async () => {
            if (response?.type !== 'success') return

            const idToken = response.params.id_token

            if (!idToken) {
                console.warn('No ID token returned from Google')
                return
            }

            try {
                const credential = GoogleAuthProvider.credential(idToken)
                const userCredential = await signInWithCredential(
                    auth,
                    credential
                )
                const { uid, email } = userCredential.user

                let user = await getUserWithPetByIdService(email!)
                if (!user) {
                    await createUserService({ uid, email })
                    user = await getUserWithPetByIdService(email!)
                }

                if (user?.pet) {
                    await useUserPetStore.getState().fetchUserAndPet(email!)
                    router.replace('/home')
                } else {
                    router.replace({
                        pathname: '/petCreate',
                        params: { userId: uid, email },
                    })
                }
            } catch (error) {
                console.error('Authentication error:', error)
            }
        }

        authenticate()
    }, [response])

    return (
        <Pressable
            onPress={() => promptAsync()}
            disabled={!request}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
                !request && styles.disabled,
            ]}
        >
            <Image
                source={require('@/assets/images/LogoGoogle.png')}
                style={styles.image}
            />
            <Text style={styles.text}>Continuar com o Google</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
        backgroundColor: 'white',
        width: 326,
        height: 66,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#80BEE7',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 5,
        borderRadius: 21,
    },
    pressed: {
        backgroundColor: '#f0f0f0',
        transform: [{ scale: 0.98 }],
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        elevation: 3,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 12,
    },
    image: {
        width: 24,
        height: 24,
    },
})

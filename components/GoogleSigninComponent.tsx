import React from 'react'
import { Text, StyleSheet, Pressable, Image } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import { useEffect } from 'react'
import { auth } from '../firebaseConfig'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import * as AuthSession from 'expo-auth-session'
import {
    createUserService,
    getUserWithPetByIdService,
} from '@/services/userService'
import { useRouter } from 'expo-router'
import { useUserPetStore } from '@/stores/userPetStore'

const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
    scheme: 'myapp',
})

console.log('Redirect URI:', redirectUri)

export default function GoogleSigninButton() {
    const router = useRouter()
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
            '823465219976-5t5443kohpdm9kda4ne1k4cib0gmcutd.apps.googleusercontent.com',
        iosClientId:
            '823465219976-9tr8frv4ksgmeh6l3ai4tdgu4hfpcejg.apps.googleusercontent.com',
        clientId:
            '823465219976-5gioroqbrn0134u220jagvasotqs7rbo.apps.googleusercontent.com',
        redirectUri: redirectUri,
        responseType: 'id_token',
    })

    useEffect(() => {
        console.log('Auth request object:', request)
        if (response?.type === 'success') {
            const { id_token } = response.params
            const credential = GoogleAuthProvider.credential(id_token)

            signInWithCredential(auth, credential)
                .then(async (userCredential) => {
                    const userId = userCredential.user.uid || ''
                    const email = userCredential.user.email || ''

                    // Try to fetch user (not from store, but directly from Firestore/service)
                    let user = await getUserWithPetByIdService(email)

                    if (!user) {
                        // Create user in Firestore
                        await createUserService({ uid: userId, email })
                        // Fetch again
                        user = await getUserWithPetByIdService(email)
                    }

                    // Only navigate, do NOT set in store yet
                    if (user && user.pet) {
                        console.log('User with pet found:', user)
                        await useUserPetStore.getState().fetchUserAndPet(email)
                        router.replace('/home')
                    } else {
                        router.replace({
                            pathname: '/petCreate',
                            params: { userId, email },
                        })
                    }
                })
                .catch((error) => {
                    console.error('Firebase login error:', error)
                })
        }
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

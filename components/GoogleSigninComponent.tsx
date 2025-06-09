import React, { useEffect } from 'react'
import { Text, StyleSheet, Pressable, Image, Alert } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import {
    createUserService,
    getUserWithPetByIdService,
} from '@/services/userService'
import { useRouter } from 'expo-router'
import { useUserPetStore } from '@/stores/userPetStore'
import Constants from 'expo-constants';


const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.ages.ludopets',
    useProxy: false,  
})

console.log('redirectUri', redirectUri)
Alert.alert("Redirect URI", redirectUri);

export default function GoogleSigninButton() {
    const router = useRouter()

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        clientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        redirectUri,
        responseType: 'token',
        scopes: ['openid', 'profile', 'email'],
    })

    useEffect(() => {
        const authenticate = async () => {
            if (response?.type === 'success') {
                const accessToken = response.authentication?.accessToken;
                if (!accessToken) {
                    console.error('No access token found in Google response.');
                    return;
                }

                try {
                    // Option 1: If you need an ID token, you can fetch user info
                    // and then authenticate with Firebase using the access token
                    const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }).then(res => res.json());
                    
                    if (!userInfo.email) {
                        console.error('No email found in user info');
                        return;
                    }

                    // Option 2: Or if you prefer to use Firebase's Google Auth Provider
                    const credential = GoogleAuthProvider.credential(null, accessToken);

                    const userCredential = await signInWithCredential(auth, credential);
                    const userId = userCredential.user.uid;
                    const email = userCredential.user.email;

                    let user = await getUserWithPetByIdService(email!);

                    if (!user) {
                        await createUserService({ uid: userId, email });
                        user = await getUserWithPetByIdService(email!);
                    }

                    if (user && user.pet) {
                        await useUserPetStore.getState().fetchUserAndPet(email!);
                        router.replace('/home');
                    } else {
                        router.replace({
                            pathname: '/petCreate',
                            params: { userId, email },
                        });
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                }
            }
        }

        authenticate();
    }, [response]);

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

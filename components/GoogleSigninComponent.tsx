import React, { useEffect } from 'react';
import { 
    Text, 
    StyleSheet, 
    Pressable, 
    Image, 
    Platform, 
    TouchableOpacity 
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
    getUserWithPetByEmail,
} from '@/services/userService';
import { useRouter } from 'expo-router';
import { useUserPetStore } from '@/stores/userPetStore';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';

const redirectUri = AuthSession.makeRedirectUri({
    useProxy: Platform.OS !== 'web',
    native: Platform.OS !== 'web' ? 'com.ages.ludopets://' : undefined,
});

export default function GoogleSigninButton() {
    const router = useRouter();
    const [request, response, promptAsync] = useIdTokenAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        redirectUri,
    });

    useEffect(() => {
        const authenticate = async () => {
            if (response?.type !== 'success') return;

            // Para a web, o token pode vir em 'id_token', para mobile pode ser diferente
            const { id_token } = response.params;

            if (!id_token) {
                console.warn('Nenhum ID token retornado do Google');
                return;
            }

            try {
                const credential = GoogleAuthProvider.credential(id_token);
                const userCredential = await signInWithCredential(auth, credential);
                const { uid, email } = userCredential.user;

                let user = await getUserWithPetByEmail(email!);
                if (!user) {
                    user = await getUserWithPetByEmail(email!);
                }

                if (user?.pet) {
                    await useUserPetStore.getState().fetchUserAndPetByEmail(email!);
                    router.replace('/home');
                } else {
                    router.replace({
                        pathname: '/petCreate',
                        params: { userId: uid, email },
                    });
                }
            } catch (error) {
                console.log('Erro de autenticação:', error);
            }
        };

        authenticate();
    }, [response, router]);

    if (Platform.OS === 'web') {
        return (
            <TouchableOpacity
                onPress={() => promptAsync()}
                disabled={!request}
                style={[styles.buttonWeb, !request && styles.disabledWeb]}
                activeOpacity={0.8}
            >
               {/* https://developers.google.com/identity/branding-guidelines */}
                <svg width="24" height="24" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <Text style={styles.textWeb}>Continuar com o Google</Text>
            </TouchableOpacity>
        );
    }

    return (
        <Pressable
            onPress={() => promptAsync()}
            disabled={!request}
            style={({ pressed }) => [
                styles.buttonNative,
                pressed && styles.pressedNative,
                !request && styles.disabledNative,
            ]}
        >
            <Image
                source={require('@/assets/images/LogoGoogle.png')}
                style={styles.imageNative}
            />
            <Text style={styles.textNative}>Continuar com o Google</Text>
        </Pressable>
    );
}

// https://developers.google.com/identity/branding-guidelines
const styles = StyleSheet.create({
    buttonNative: {
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
    pressedNative: {
        backgroundColor: '#f0f0f0',
        transform: [{ scale: 0.98 }],
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        elevation: 3,
    },
    disabledNative: {
        opacity: 0.5,
    },
    textNative: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 12,
        color: '#1f2937',
    },
    imageNative: {
        width: 24,
        height: 24,
    },

    buttonWeb: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 326,
        height: 66,
        backgroundColor: 'white',
        borderRadius: 21,
        borderWidth: 0,
        cursor: 'pointer',
        boxShadow: '2px 2px 7px #80BEE7',
        transition: 'all 0.2s ease-in-out',
    },
    textWeb: {
        fontFamily: '"Inter", sans-serif',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#1f2937',
    },
    disabledWeb: {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
});

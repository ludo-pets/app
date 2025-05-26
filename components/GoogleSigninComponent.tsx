import React from 'react';
import { Text, StyleSheet, Pressable, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import { useUserPetStore } from '@/stores/userPetStore';
import { createUserService } from '@/services/userService';
import { useRouter } from 'expo-router';

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
  scheme: 'myapp',
});

console.log('Redirect URI:', redirectUri);

export default function GoogleSigninButton() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '823465219976-5t5443kohpdm9kda4ne1k4cib0gmcutd.apps.googleusercontent.com',
    iosClientId: '823465219976-9tr8frv4ksgmeh6l3ai4tdgu4hfpcejg.apps.googleusercontent.com',
    clientId: '823465219976-5gioroqbrn0134u220jagvasotqs7rbo.apps.googleusercontent.com',
    redirectUri: redirectUri,
    responseType: 'id_token',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const userId = userCredential.user.uid;
          const email = userCredential.user.email || '';

          // Try to fetch user and pet
          await useUserPetStore.getState().fetchUserAndPet(email);

          let user = useUserPetStore.getState().user;

          if (!user) {
            // No user found, create new user
            await createUserService({ uid: userId, email });
            // Fetch again to get the new user
            await useUserPetStore.getState().fetchUserAndPet(email);
            user = useUserPetStore.getState().user;
          }

          if (user) {
            useUserPetStore.getState().setUser(user);
            // If user has a pet, go to home, else go to petCreate
            if (user.pet) {
              router.replace('/home');
            } else {
              router.replace('/petCreate');
            }
          }
        })
        .catch((error) => {
          console.error('Firebase login error:', error);
        });
    }
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
      <Image source={require('@/assets/images/LogoGoogle.png')} style={styles.image} />
      <Text style={styles.text}>Sign in with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: 'white',
    width: 326,
    height: 66,
    flexDirection: 'row', // 👈 Coloca os itens lado a lado
    alignItems: 'center', // 👈 Centraliza verticalmente
    justifyContent: 'center', // 👈 Centraliza horizontalmente

    shadowColor: '#80BEE7',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 5,
    borderRadius: 21,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 12, // 👈 Espaço entre logo e texto
  },
  image: {
    width: 24,
    height: 24,
  },
});

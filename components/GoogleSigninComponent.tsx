import React from 'react';
import { Text, StyleSheet, Pressable, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
  scheme: 'myapp',
});

console.log('Redirect URI:', redirectUri);

export default function GoogleSigninButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '823465219976-5t5443kohpdm9kda4ne1k4cib0gmcutd.apps.googleusercontent.com',
    iosClientId: '823465219976-9tr8frv4ksgmeh6l3ai4tdgu4hfpcejg.apps.googleusercontent.com',
    clientId: '823465219976-5gioroqbrn0134u220jagvasotqs7rbo.apps.googleusercontent.com',
    redirectUri: redirectUri,
    responseType: 'id_token',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log(response.params);
      const { id_token } = response.params;
      console.log(id_token);
      const credential = GoogleAuthProvider.credential(id_token);
      console.log(credential)
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('Logged in user:', userCredential.user);
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

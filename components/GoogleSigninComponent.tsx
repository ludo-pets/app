import React from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';

const redirectUri = 'https://auth.expo.io/@llopex/ludopets';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSigninButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '823465219976-5t5443kohpdm9kda4ne1k4cib0gmcutd.apps.googleusercontent.com',
    iosClientId: '823465219976-9tr8frv4ksgmeh6l3ai4tdgu4hfpcejg.apps.googleusercontent.com',
    clientId: '823465219976-5gioroqbrn0134u220jagvasotqs7rbo.apps.googleusercontent.com',
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
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
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}

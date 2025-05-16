import React from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';

console.log(AuthSession.makeRedirectUri());

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSigninButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'ludo-pets.apps.googleusercontent.com',
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

import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFoi2BYgJB2YOeafkWz4g7_x71BYvFvKE",
  authDomain: "ludo-pets.firebaseapp.com",
  projectId: "ludo-pets",
  storageBucket: "ludo-pets.firebasestorage.app",
  appId: "1:823465219976:android:cd5b86d09b91269a5d8c3d",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
export { firebaseApp, db };

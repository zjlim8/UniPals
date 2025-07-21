import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGMu9CKb1h3ryBCHsc8Le9DSFZuvjcw3Q",
  authDomain: "unipals-470a5.firebaseapp.com",
  projectId: "unipals-470a5",
  storageBucket: "unipals-470a5.firebasestorage.app",
  messagingSenderId: "8774325765",
  appId: "1:8774325765:web:37d8fb267da5ea6a8b6e6c",
  measurementId: "G-448DVQ3LYM",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

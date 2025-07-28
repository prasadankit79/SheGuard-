import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBT4qU4DIgeoE6RGgNzPGMhaADNj4YrDPo",
  authDomain: "sheguard-af2a0.firebaseapp.com",
  projectId: "sheguard-af2a0",
  storageBucket: "sheguard-af2a0.firebasestorage.app",
  messagingSenderId: "251631415071",
  appId: "1:251631415071:web:469cb0ddc9f52c7cd90a2a",
  measurementId: "G-M01YXVE82N"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-sheguard-app';

export { auth, db, appId };
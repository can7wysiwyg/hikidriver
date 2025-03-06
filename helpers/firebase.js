// firebase.js
import { initializeApp, getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDdp8aOV_WrBInQ1U2gpkWK9YQHwZTMpvI",
  authDomain: "kalichangu.firebaseapp.com",
  projectId: "kalichangu",
  storageBucket: "kalichangu.appspot.com",
  messagingSenderId: "60604214836",
  appId: "1:60604214836:android:101179dcb66c3cff9e6461",
};

// Initialize Firebase using the newer API pattern
let app;
try {
  app = getApp();
} catch (error) {
  app = initializeApp(firebaseConfig);
}

// Get messaging instance
const messaging = getMessaging(app);

export { app, messaging };
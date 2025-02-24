import firebase from "firebase/compat/app";

const firebaseConfig = {
    apiKey: "AIzaSyBwfqNRXWWG-a8F455MCQgwiLMJHDIBdMA",
    authDomain: "messagingtesto.firebaseapp.com",
    projectId: "messagingtesto",
    storageBucket: "messagingtesto.firebasestorage.app",
    messagingSenderId: "574412648652",
    appId: "1:574412648652:android:5ed9875934285e55e75269",
  };


  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // If already initialized
  }
  
  export default firebase;
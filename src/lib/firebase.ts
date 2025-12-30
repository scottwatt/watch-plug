import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase config from console
const firebaseConfig = {
  apiKey: "AIzaSyCaNrKyyNUdt9L4xsLKyz2yAl-rxXss9Qo",
  authDomain: "watch-plug-1.firebaseapp.com",
  projectId: "watch-plug-1",
  storageBucket: "watch-plug-1.firebasestorage.app",
  messagingSenderId: "478262900344",
  appId: "1:478262900344:web:6ed2830234f8c72eeedf8d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
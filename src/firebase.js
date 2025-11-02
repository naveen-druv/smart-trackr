// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAGxujPJ6lAxCt-FHcg7OBgVcEq0qWZa4w',
  authDomain: 'smart-trackr-189e2.firebaseapp.com',
  projectId: 'smart-trackr-189e2',
  storageBucket: 'smart-trackr-189e2.firebasestorage.app',
  messagingSenderId: '1071152778495',
  appId: '1:1071152778495:web:c3d2f6831eb3be1863d0ca',
  measurementId: 'G-B705N9Q4L1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getFirestore(app);
// const analytics = getAnalytics(app);

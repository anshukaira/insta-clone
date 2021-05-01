import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const app = firebase.initializeApp({
    apiKey: process.env.EXPO_FIREBASE_APIKEY,
    authDomain: process.env.EXPO_FIREBASE_AUTHDOMAIN,
    projectId: process.env.EXPO_FIREBASE_PROJECTID,
    storageBucket: process.env.EXPO_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.EXPO_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.EXPO_FIREBASE_APPID,
    measurementId: process.env.EXPO_FIREBASE_MEASUREMENTID
});

export const firestore = app.firestore();
export const auth = app.auth();
export const storage = app.storage();
export const FieldValue = firebase.firestore.FieldValue
export default app;
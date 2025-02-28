import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDWYtCkv2TpZ_RFCT4ZELiVhU4kn84ohw8",
  authDomain: "fitmix-47b0b.firebaseapp.com",
  projectId: "fitmix-47b0b",
  storageBucket: "fitmix-47b0b.appspot.com",
  messagingSenderId: "582605620880",
  appId: "1:582605620880:web:1e20d0d083214fa572ba15",
  measurementId: "G-59JVEXHPJM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

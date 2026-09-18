import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC6zVuwk9PBlW9NCnChMdj5-lkCAU9EfxE",
  authDomain: "lhg-by-duseca.firebaseapp.com",
  projectId: "lhg-by-duseca",
  storageBucket: "lhg-by-duseca.appspot.com",
  messagingSenderId: "1020518883159",
  appId: "1:1020518883159:web:4d7e8c0739aaca7b912812",
  measurementId: "G-QVLTC4Q9JE",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

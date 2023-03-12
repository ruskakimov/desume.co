import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyB34gwQ0mKdYJEUg36TBjtaSbujmZSVjZw",
  authDomain: "pdfegg.firebaseapp.com",
  projectId: "pdfegg",
  storageBucket: "pdfegg.appspot.com",
  messagingSenderId: "474976026369",
  appId: "1:474976026369:web:5ef3a3eeed72e408d5e500",
  measurementId: "G-Y3QWR9FZKF",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp);

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

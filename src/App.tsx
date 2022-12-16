import AppShell from "./AppShell";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB34gwQ0mKdYJEUg36TBjtaSbujmZSVjZw",
  authDomain: "pdfegg.firebaseapp.com",
  projectId: "pdfegg",
  storageBucket: "pdfegg.appspot.com",
  messagingSenderId: "474976026369",
  appId: "1:474976026369:web:5ef3a3eeed72e408d5e500",
  measurementId: "G-Y3QWR9FZKF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

function App() {
  const [user, loading, error] = useAuthState(auth);
  console.log(user);
  return <AppShell />;
}

export default App;

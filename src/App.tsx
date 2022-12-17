import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster } from "react-hot-toast";
import AppShell from "./AppShell";
import LoginPage from "./pages/login/LoginPage";

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

function App() {
  const [user] = useAuthState(firebaseAuth);
  return (
    <>
      {user ? <AppShell /> : <LoginPage />}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
    </>
  );
}

export default App;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import AppShell from "./AppShell";

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
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AppShell />;
}

export default App;

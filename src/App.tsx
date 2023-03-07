import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import { firebaseAuth } from "./api/firebase-setup";
import AppShell from "./AppShell";
import logo from "./assets/images/logo.svg";

export interface AppUser {
  isProMember: boolean;
}

const defaultAppUser: AppUser = {
  isProMember: false,
};

export const AppUserContext = createContext<AppUser>(defaultAppUser);

function App() {
  const [user, loadingAuth] = useAuthState(firebaseAuth);
  const [appUser, setAppUser] = useState(defaultAppUser);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        const isProMember = idTokenResult.claims.pro_member || false;
        setAppUser({ isProMember });
      });
    }
  }, [user]);

  if (loadingAuth) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <img className="mx-auto h-12 w-auto" src={logo} alt="PDFEGG" />
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return (
    <AppUserContext.Provider value={appUser}>
      <AppShell />
    </AppUserContext.Provider>
  );
}

export default App;

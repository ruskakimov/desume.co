import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { firebaseAuth } from "./api/firebase-setup";
import AppShell from "./AppShell";
import logo from "./assets/images/logo.svg";
import { ReviewProvider } from "./pages/review/review-context";

export interface AppUser {
  uid: string;
  isProMember: boolean;
}

const defaultAppUser: AppUser = {
  uid: "",
  isProMember: false,
};

const AppUserContext = createContext<AppUser>(defaultAppUser);

export function useUserContext(): AppUser {
  return useContext(AppUserContext);
}

function App() {
  const [user, loadingAuth] = useAuthState(firebaseAuth);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          const isProMember = idTokenResult.claims.pro_member || false;
          setAppUser({ isProMember, uid: user.uid });
        })
        .catch((e) => {
          console.error("Error when retrieving custom claims:", e);
          toast.error("Something went wrong while verifying your Pro status.");
          setAppUser({ isProMember: false, uid: user.uid });
        });
    } else {
      setAppUser(null);
    }
  }, [user]);

  if (!loadingAuth && !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (loadingAuth || appUser === null) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <img className="mx-auto h-12 w-auto" src={logo} alt="" />
      </div>
    );
  }

  return (
    <AppUserContext.Provider value={appUser}>
      <ReviewProvider>
        <AppShell />
      </ReviewProvider>
    </AppUserContext.Provider>
  );
}

export default App;

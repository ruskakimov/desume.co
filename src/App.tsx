import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import { firebaseAuth } from "./api/firebase-setup";
import AppShell from "./AppShell";
import logo from "./assets/images/logo.svg";

function App() {
  const [user, loadingAuth] = useAuthState(firebaseAuth);
  const location = useLocation();

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

  return <AppShell />;
}

export default App;

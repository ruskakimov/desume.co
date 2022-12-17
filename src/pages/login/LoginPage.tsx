import SecondaryButton from "../../common/components/SecondaryButton";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import logo from "../../assets/logo.svg";
import googleLogo from "../../assets/google-logo.svg";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../../App";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LoginPage: React.FC<{ isSignup?: boolean }> = ({ isSignup = false }) => {
  const [signInWithGoogle, user, googleLoading, googleError] =
    useSignInWithGoogle(firebaseAuth);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const onLoggedIn = () => navigate(from, { replace: true });

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-12 w-auto" src={logo} alt="PDFEGG" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-700">
            {isSignup ? "Create a new account" : "Sign in to your account"}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {googleError && (
              <p className="mb-4 text-sm text-red-700">{googleError.message}</p>
            )}

            <SocialButton
              icon={googleLogo}
              label="Continue with Google"
              onClick={() => signInWithGoogle().then(onLoggedIn)}
            />

            <OrSeparator />

            {isSignup ? (
              <SignupForm onSuccess={onLoggedIn} />
            ) : (
              <LoginForm onSuccess={onLoggedIn} />
            )}

            <div className="mt-4 text-center">
              {isSignup ? (
                <Link to="/sign-in" className="text-sm text-gray-600 underline">
                  Have an account? Sign in
                </Link>
              ) : (
                <Link to="/sign-up" className="text-sm text-gray-600 underline">
                  Don't have an account? Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const OrSeparator: React.FC = () => {
  return (
    <div className="my-6 relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">OR</span>
      </div>
    </div>
  );
};

const SocialButton: React.FC<{
  icon: string;
  label?: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <SecondaryButton className="w-full text-gray-500" onClick={onClick}>
      <img className="h-5 w-5" src={icon} />
      {label !== undefined && <span className="ml-2">{label}</span>}
    </SecondaryButton>
  );
};

export default LoginPage;

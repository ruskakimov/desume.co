import { AuthError, sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { firebaseAuth } from "../../App";
import logo from "../../assets/logo.svg";
import TextField from "../../common/components/fields/TextField";
import PrimaryButton from "../../common/components/PrimaryButton";
import Spinner from "../../common/components/Spinner";

interface EmailForm {
  email: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailForm>();
  const [sendingEmail, setSendingEmail] = useState(false);

  const onSubmit: SubmitHandler<EmailForm> = ({ email }) => {
    setSendingEmail(true);
    sendSignInLinkToEmail(firebaseAuth, email, {
      url: window.location.href,
      handleCodeInApp: true,
    })
      .then(() => toast.success("Access link was sent to your email."))
      .catch((e: AuthError) => {
        switch (e.code) {
          case "auth/invalid-email":
            setError(
              "email",
              { message: "Invalid email address." },
              { shouldFocus: true }
            );
            break;
          default:
            toast.error(e.message);
        }
      })
      .finally(() => setSendingEmail(false));
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-12 w-auto" src={logo} alt="PDFEGG" />
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", { required: "Email is required." })}
              />

              {/*
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Password is required.",
                  })}
                />
              */}

              {/* <div className="flex items-center justify-between">
                <CheckboxField label="Remember me" />

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div> */}

              <PrimaryButton type="submit" className="w-full">
                {sendingEmail ? <Spinner /> : "Continue with email"}
              </PrimaryButton>
            </form>

            <OrSeparator />

            <div className="flex flex-col gap-3">
              <SocialButton />
              <SocialButton />
              <SocialButton />
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

const SocialButton: React.FC = () => {
  return (
    <a
      href="#"
      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
    >
      <svg
        className="h-5 w-5"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
          clipRule="evenodd"
        />
      </svg>
      <span className="ml-2">Continue with Facebook</span>
    </a>
  );
};

export default LoginPage;

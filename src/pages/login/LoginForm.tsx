import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { firebaseAuth } from "../../App";
import TextField from "../../common/components/fields/TextField";
import PrimaryButton from "../../common/components/PrimaryButton";
import Spinner from "../../common/components/Spinner";

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const [signingIn, setSigningIn] = useState(false);

  const onSubmit: SubmitHandler<FormData> = ({ email, password }) => {
    setSigningIn(true);
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .catch((e: AuthError) => {
        switch (e.code) {
          case "auth/invalid-email":
            setError(
              "email",
              { message: "Invalid email address." },
              { shouldFocus: true }
            );
            break;
          case "auth/user-not-found":
            setError(
              "email",
              { message: "Email is not registered." },
              { shouldFocus: true }
            );
            break;
          case "auth/wrong-password":
            setError(
              "password",
              { message: "Wrong password." },
              { shouldFocus: true }
            );
            break;
          default:
            toast.error(e.message);
        }
      })
      .finally(() => setSigningIn(false));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Email address"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", { required: "Email is required." })}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required.",
        })}
      />

      <PrimaryButton type="submit" className="w-full">
        {signingIn ? <Spinner /> : "Sign in"}
      </PrimaryButton>
    </form>
  );
};

export default LoginForm;

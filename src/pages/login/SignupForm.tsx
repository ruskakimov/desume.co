import { AuthError, createUserWithEmailAndPassword } from "firebase/auth";
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

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const [signingUp, setSigningUp] = useState(false);

  const onSubmit: SubmitHandler<FormData> = ({ email, password }) => {
    setSigningUp(true);
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .catch((e: AuthError) => {
        switch (e.code) {
          case "auth/invalid-email":
            setError(
              "email",
              { message: "Invalid email address." },
              { shouldFocus: true }
            );
            break;
          case "auth/email-already-in-use":
            setError(
              "email",
              { message: "Email is already used." },
              { shouldFocus: true }
            );
            break;
          default:
            toast.error(e.message);
        }
      })
      .finally(() => setSigningUp(false));
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
          minLength: {
            value: 8,
            message: "Password should be at least 8 characters long.",
          },
        })}
      />

      <PrimaryButton type="submit" className="w-full">
        {signingUp ? <Spinner /> : "Sign up"}
      </PrimaryButton>
    </form>
  );
};

export default SignupForm;

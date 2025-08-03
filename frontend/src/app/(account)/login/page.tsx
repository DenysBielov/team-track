"use client";

import { capitalizeFirstLetter } from "@/utils/stringUtils";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import {
  FaRegEye as EyeIcon,
  FaRegEyeSlash as EyeIconCrossed,
} from "react-icons/fa6";
import Loader from "@/components/Loader";
import { useAuth } from "@/lib/auth/authContext";
import { sendVerification } from "@/lib/requests/auth";

function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const callback = searchParams.get("callback");

  const credentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log('About to call login...');
      await login(email, password);
      console.log('Login completed, about to redirect...');
      
      // Small delay to ensure cookie is set before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsLoading(false);
      
      const targetRoute = callback || "/events";
      console.log('Redirecting to:', targetRoute);
      
      // Use window.location for a hard redirect to ensure it works
      window.location.href = targetRoute;
    } catch (error: any) {
      setIsLoading(false);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed";
      setError(message);

      // Check if the error is about email not being confirmed
      if (message === "Email not confirmed") {
        setUnconfirmedEmail(email);
      } else {
        setUnconfirmedEmail(null);
      }

      console.error("Login error:", error);
    }
  };

  const handleResendEmail = async () => {
    if (!unconfirmedEmail) return;

    setIsLoading(true);
    setError(null);
    setResendSuccess(false);

    try {
      await sendVerification(unconfirmedEmail);
      setResendSuccess(true);
    } catch (error: any) {
      setError("Failed to send verification email. Please try again.");
      console.error("Resend email error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-96 w-fit self-center relative">
      {isLoading && (
        <Loader className="bg-black/55 absolute inset-0 -m-4 rounded-md" />
      )}
      <form onSubmit={credentialsSignIn} className="flex flex-col gap-4">
        <div>
          Do not have an account?{" "}
          <Link href={"/sign-up"} className="link">
            Register
          </Link>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {resendSuccess && (
          <div className="text-green-500">
            Verification email sent! Please check your inbox.
          </div>
        )}
        {unconfirmedEmail && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800 text-sm mb-2">
              Your email address is not confirmed. Please check your inbox for a
              verification email.
            </p>
            <button
              type="button"
              onClick={handleResendEmail}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
              disabled={isLoading}
            >
              Resend verification email
            </button>
          </div>
        )}
        <input
          name="email"
          type="text"
          className="input outline outline-1 w-full"
          onChange={() => {
            setError("");
            setUnconfirmedEmail(null);
            setResendSuccess(false);
          }}
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className="input outline outline-1 w-full"
            onChange={() => {
              setError("");
              setUnconfirmedEmail(null);
              setResendSuccess(false);
            }}
          />
          <span
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIconCrossed /> : <EyeIcon />}
          </span>
        </div>
        <Link href={"/forgot-password"} className="link">
          Forgot your password?
        </Link>
        <button className="btn btn-success text-neutral-100">Login</button>
      </form>
      <div className="divider">OR</div>
      <div className="flex flex-col gap-4"></div>
    </div>
  );
}

function getProviderLogo(id: string) {
  const iconSize = 24;
  switch (id) {
    case "google":
      return <GoogleIcon size={iconSize} />;
    default:
      return <></>;
  }
}

export default LoginPage;

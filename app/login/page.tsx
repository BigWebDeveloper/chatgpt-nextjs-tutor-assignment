"use client";

import { useFormSubmit } from "@/app/hooks/useFormSubmit";
import FormInput from "@/app/ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import Link from "next/link";
import { SubmitEvent } from "react";

const LoginPage = () => {
  const { handleSubmit, isLoading, error, success } =
    useFormSubmit("/api/auth/login");
  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    handleSubmit(e, () => {
      form.reset();
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Login</h1>

        <p className="mb-8 text-center text-gray-500">
          Sign in to your account
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <FormInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            required
          />
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            required
          />
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950">
              ✓ Login successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-secondary py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}{" "}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&#39;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold cursor-pointer hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

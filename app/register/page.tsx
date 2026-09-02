"use client";

import { SubmitEvent, useState } from "react";
import { useFormSubmit } from "@/app/hooks/useFormSubmit";
import PasswordInput from "../ui/PasswordInput";
import Link from "next/link";
import FormInput from "../ui/FormInput";

const RegisterPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { handleSubmit, isLoading, error, success } =
    useFormSubmit("/api/auth/register");

  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    const form = e.currentTarget;

    handleSubmit(e, () => {
      form.reset();
      setPassword("");
      setConfirmPassword("");
    });
  };

  return (
    <div className="flex items-center  justify-center h-screen">
      <div className=" sm:max-w-md w-11/12 rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Create Account</h1>

        <p className="mb-8 text-center text-gray-500">Register a new account</p>

        <form className="space-y-5" onSubmit={onSubmit}>
          <FormInput
            id="name"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            required
          />

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              confirmPassword && !passwordsMatch
                ? "Passwords do not match"
                : undefined
            }
            required
          />
          <div className="w-full grid">
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              defaultValue="user"
              name="role"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950">
              ✓ Account created successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-secondary py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

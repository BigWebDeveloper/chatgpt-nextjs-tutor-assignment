"use client";
import { useState, ChangeEvent, SubmitEvent } from "react";
import { useFormSubmit } from "@/app/hooks/useFormSubmit";
import FormInput from "@/app/ui/FormInput";

const RegisterPage = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const { handleSubmit, isLoading, error, success } =
    useFormSubmit("/api/register");

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    handleSubmit(e, () => {
      setPreview(null);
      e.currentTarget.reset();
    });
  };
  return (
    <div className="flex items-center  justify-center h-screen">
      <div className=" sm:max-w-md w-11/12 rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Create Account</h1>

        <p className="mb-8 text-center text-gray-500">Register a new account</p>

        <form className="space-y-5">
          <FormInput
            id="name"
            label="Full Name"
            placeholder="Enter your full name"
          />

          <FormInput
            id="email"
            label="Email Address"
            placeholder="Enter your email"
          />

          <FormInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-black hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

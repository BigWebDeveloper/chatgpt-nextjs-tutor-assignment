"use client";

import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const FormInput = ({
  id,
  label,
  error,
  className = "",
  ...props
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium ">
        {label}
      </label>

      <input
        id={id}
        name={id}
        className={`w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;

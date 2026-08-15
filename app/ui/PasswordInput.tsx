"use client";

import { InputHTMLAttributes, useState } from "react";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const PasswordInput = ({
  id,
  label,
  error,
  className = "",
  ...props
}: FormInputProps) => {
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <div className="group relative">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        id={id}
        type={hidePassword ? "password" : "text"}
        name={id}
        className={`w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black ${className}`}
        {...props}
      />
      <p
        onClick={() => setHidePassword(!hidePassword)}
        className="group-hover:block hidden absolute top-11 right-4"
      >
        {hidePassword ? <IoEyeOff /> : <IoEye />}
      </p>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;

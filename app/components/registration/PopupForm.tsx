"use client";

import { useStore } from "@/app/context/StoreContext";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import LoadingEffect from "@/app/template/LoadingEffect";
import { PopupFormProps, FormDataState } from "@/app/types/frontend";

const PopupForm = ({ current }: PopupFormProps) => {
  const { setIsLoginPopup } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<FormDataState>({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Next.js uses process.env.NEXT_PUBLIC_* instead of import.meta.env
    const baseUrl = process.env.NEXT_PUBLIC_ADV_TENNIS_API_END_POINT_URL || "";
    const newUrl =
      current === "Login"
        ? `${baseUrl}/api/user/login`
        : `${baseUrl}/api/user/register`;

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        // localStorage.setItem("token", response.data.token);
        setIsLoginPopup(false); // Typically false to close popup after success
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={register} className="flex flex-col gap-4 ">
      {current !== "Login" && (
        <label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border border-gray-300 rounded"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </label>
      )}

      <label>
        <input
          type="email"
          name="email"
          value={data.email}
          className="w-full p-2 border border-gray-300 rounded"
          onChange={onChangeHandler}
          placeholder="Your email"
          required
          autoComplete="email"
        />
      </label>
      <label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={onChangeHandler}
          placeholder="Your password"
          required
          className="w-full p-2 border border-gray-300 rounded"
          autoComplete="current-password"
        />
      </label>
      <button
        type="submit"
        className="w-full p-2 mt-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingEffect loading={isLoading} />
        ) : (
          <div>{current === "Login" ? "Login" : "Create Account"}</div>
        )}
      </button>
      <label className="checkbox">
        <input type="checkbox" name="checkbox" required />
        By continuing, I agree to the terms of use & privacy policy.
      </label>
    </form>
  );
};

export default PopupForm;

"use client";

import { useState, ChangeEvent, SubmitEvent } from "react";
import { useFormSubmit } from "@/app/hooks/useFormSubmit";
import Image from "next/image";

export function MusicUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const { handleSubmit, isLoading, error, success } =
    useFormSubmit("/api/upload");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file)); // Replaces cumbersome FileReader!
  };

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    handleSubmit(e, () => {
      setPreview(null);
      e.currentTarget.reset();
    });
  };

  return (
    <div className="mx-auto sm:w-80 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h1 className="text-2xl font-bold dark:text-white">Upload Music</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Share your track with us
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput id="title" label="Title" placeholder="Enter song title" />
        <FormInput id="artist" label="Artist" placeholder="Enter artist name" />

        {/* Cover Image Input */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-300">
            Cover Image
          </label>
          <div className="relative">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="rounded-md border-2 border-dashed p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-900">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  className="h-32 w-full rounded-md object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <p className="text-xs text-gray-500">
                  Click to upload cover image
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950">
            ✓ Music uploaded successfully!
          </p>
        )}

        <button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Uploading..." : "Upload Music"}
        </button>
      </form>
    </div>
  );
}

/* Helper Reusable Sub-component for Inputs */
function FormInput({
  id,
  label,
  placeholder,
}: {
  id: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        required
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      />
    </div>
  );
}

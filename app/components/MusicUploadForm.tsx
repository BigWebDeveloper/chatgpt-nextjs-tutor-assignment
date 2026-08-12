"use client";

import { useState, ChangeEvent, SubmitEvent } from "react";
import { useFormSubmit } from "@/app/hooks/useFormSubmit";
import FormInput from "@/app/ui/FormInput";
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
    const form = e.currentTarget;

    handleSubmit(e, () => {
      form.reset();
      setPreview(null);
    });
  };

  return (
    <div className="sm:max-w-md w-11/12 rounded-2xl bg-white p-6 shadow-xl ">
      <h1 className="mb-2 text-center text-3xl font-bold">Upload Music</h1>

      <p className="mb-8 text-center text-gray-500">
        {" "}
        Share your track with us
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          required
          id="title"
          label="Title"
          placeholder="Enter song title"
        />
        <FormInput
          required
          id="artist"
          label="Artist"
          placeholder="Enter artist name"
        />

        {/* Cover Image Input */}
        <div>
          <label className="mb-2 block text-sm font-medium">Cover Image</label>
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-secondary py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          {isLoading ? "Uploading..." : "Upload Music"}
        </button>
      </form>
    </div>
  );
}

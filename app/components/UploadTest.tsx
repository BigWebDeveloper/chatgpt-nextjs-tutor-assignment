"use client";

import { useActionState, useState } from "react";

type ResponseState = {
  status: "idle" | "success" | "error";
  message: string;
  file?: {
    name: string;
    size: number;
    type: string;
  };
} | null;

const UploadTest = () => {
  const [fileName, setFileName] = useState<string>("");

  // Clean form handler calling your Route Handler inside the api/ folder
  async function handleUpload(
    prevState: ResponseState,
    formData: FormData,
  ): Promise<ResponseState> {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Automatically passes 'images' if the input name matches
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          status: "error",
          message: data?.message || "Failed to upload file.",
        };
      }

      return {
        status: "success",
        message: data.message || "Uploaded successfully",
        file: data.file,
      };
    } catch (err: any) {
      return {
        status: "error",
        message: err.message || "An unexpected error occurred.",
      };
    }
  }

  const [state, formAction, isPending] = useActionState(handleUpload, null);

  return (
    <main className="bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Upload Media</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tests endpoint:{" "}
            <code className="text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded text-xs font-mono">
              /api/upload
            </code>
          </p>
        </div>

        {/* Native Form submit bound to formAction */}
        <form action={formAction} className="space-y-4">
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
            <input
              type="file"
              name="image" // Matches formData.get("image") in your API route
              required
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2 pointer-events-none">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-600 font-medium truncate px-2">
                {fileName ? fileName : "Click or drag file to select"}
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, or WEBP</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !fileName}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isPending ? "Uploading..." : "Submit to /api"}
          </button>
        </form>

        {/* Feedback States */}
        {state?.status === "error" && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {state.message}
          </div>
        )}

        {state?.status === "success" && (
          <div className="p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto space-y-2">
            <p className="text-slate-400 border-b border-slate-800 pb-1.5 font-sans font-medium">
              API Response:
            </p>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default UploadTest;

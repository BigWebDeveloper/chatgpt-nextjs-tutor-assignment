import { useState, SubmitEvent } from "react";

export function useFormSubmit<T = unknown>(url: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>,
    onSuccess?: (data: T) => void, // Optional callback parameter
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: new FormData(e.currentTarget),
      });

      const data: T = await response.json();

      if (!response.ok) {
        const errorData = data as { error?: string; message?: string };
        throw new Error(
          errorData.error || errorData.message || "Request failed",
        );
      }

      setSuccess(true);
      onSuccess?.(data); // Optional call syntax (cleaner than `if (onSuccess) onSuccess(data)`)

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, error, success };
}

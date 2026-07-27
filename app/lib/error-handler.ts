import mongoose from "mongoose";

export function handleError(error: unknown) {
  console.error(error);

  if (error instanceof SyntaxError) {
    return Response.json(
      {
        error: "Invalid JSON",
      },
      {
        status: 400,
      },
    );
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return Response.json(
      {
        error: "Validation Error",
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return Response.json(
      {
        error: "Invalid Data",
      },
      {
        status: 400,
      },
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return Response.json(
      {
        error: "Duplicate Value",
        message: "Email already exists",
      },
      {
        status: 409,
      },
    );
  }

  return Response.json(
    {
      error: "Internal Server Error",
    },
    {
      status: 500,
    },
  );
}

import { registerSchema } from "./auth";
import { updateUserSchema } from "./auth";

export function authVerify(data: unknown) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message;

    return {
      success: false,
      error: Response.json(
        {
          error: firstError,
        },
        {
          status: 400,
        },
      ),
    };
  }

  return {
    error: null,
    success: true,
    data: result.data,
  };
}

export function updateUserVerify(data: unknown) {
  const result = updateUserSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message;

    return {
      success: false,
      error: Response.json(
        {
          error: firstError,
        },
        {
          status: 400,
        },
      ),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

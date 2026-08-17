import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      user: null,
      error: "unauthorized",
    };
  }

  if (user.role !== "admin") {
    return {
      user: null,
      error: "forbidden",
    };
  }

  return {
    user,
    error: null,
  };
}

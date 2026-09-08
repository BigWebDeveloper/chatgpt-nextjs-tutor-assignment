import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { AuthPayload } from "./jwt";

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

export function hasRole(userRole: string, allowedRoles: string[]) {
  return allowedRoles.includes(userRole);
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  console.log(user?.role);

  if (!user) {
    return {
      user: null,
      error: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!hasRole(user.role as string, ["admin"])) {
    return {
      user: null,
      error: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    user,
    error: null,
  };
}

type AccessResult =
  | { user: null; error: Response }
  | { user: AuthPayload; error: null };

export async function requireVerifyIdandAdminAccess(
  id: string,
): Promise<AccessResult> {
  const user = await getAuthenticatedUser();

  // User is not logged in
  if (!user) {
    return {
      user: null,
      error: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // User is logged in but is not the owner
  // and is not an admin

  if (user.userId !== id && user.role !== "admin") {
    return {
      user: null,
      error: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return {
    user,
    error: null,
  };
}

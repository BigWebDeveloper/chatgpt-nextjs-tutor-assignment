import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

function isCustomJwtPayload(
  payload: string | JwtPayload,
): payload is CustomJwtPayload {
  return (
    typeof payload !== "string" &&
    typeof payload.id === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  );
}

export function authorize(request: Request): CustomJwtPayload {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.replace("Bearer ", "");

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  if (!isCustomJwtPayload(decoded)) {
    throw new Error("INVALID_PAYLOAD");
  }

  return decoded;
}

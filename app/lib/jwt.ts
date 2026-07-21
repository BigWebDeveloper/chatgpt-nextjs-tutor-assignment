// lib/jwt.ts
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export function generateToken(user: {
  _id: string;
  email: string;
  role?: string;
}): string {
  const payload: JWTPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

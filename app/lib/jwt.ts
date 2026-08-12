import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

export interface AuthPayload {
  userId: string;
  email: string;
  role?: "user" | "admin";
}

const config = {
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: "7d" as SignOptions["expiresIn"],
};

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

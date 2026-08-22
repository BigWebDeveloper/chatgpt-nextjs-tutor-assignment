import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export interface iUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface iSong extends Document {
  title: string;
  artist: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface iBooks extends Document {
  title: string;
  author: string;
  year: number;
  genre: string;
}
export interface iOrder extends Document {
  user: string;
  items: string;
  total: number;
  status: string;
}

export type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

export type GlobalWithMongoose = typeof globalThis & {
  mongoose?: MongooseCache;
};

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface CustomJwtPayload extends jwt.JwtPayload {
  role?: string;
}

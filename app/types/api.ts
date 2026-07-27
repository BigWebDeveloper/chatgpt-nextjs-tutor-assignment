import mongoose from "mongoose";

export interface iUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
export interface iBooks extends Document {
  title: string;
  author: string;
  year: number;
  genre: string;
}

export type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

export type GlobalWithMongoose = typeof globalThis & {
  mongoose?: MongooseCache;
};

interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

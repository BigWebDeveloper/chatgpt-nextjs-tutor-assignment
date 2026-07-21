import mongoose from "mongoose";
import type { GlobalWithMongoose } from "../types/api";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const globalWithMongoose = global as GlobalWithMongoose;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

const cached = globalWithMongoose.mongoose;

export async function connectDB() {
  if (cached.conn) {
    console.log("🟢 MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected successfully");

  return cached.conn;
}

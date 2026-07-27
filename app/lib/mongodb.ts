import mongoose from "mongoose";
import type { GlobalWithMongoose } from "../types/api";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const MONGODB_URI: string = mongoUri;

const globalWithMongoose = global as GlobalWithMongoose;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

const cached = globalWithMongoose.mongoose;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      cached.conn = null;
      cached.promise = null;
    }
    // Already connected
    if (cached.conn && mongoose.connection.readyState === 1) {
      console.log("🟢 MongoDB already connected");
      return cached.conn;
    }

    // Connection already in progress
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: "test",
        bufferCommands: false,
      });
    }
    cached.conn = await cached.promise;

    console.log("✅ MongoDB connected successfully");

    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);

    // Reset the promise so future attempts can retry
    cached.promise = null;

    throw error;
  }
}

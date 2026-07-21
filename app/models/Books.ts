import mongoose, { Schema, Model } from "mongoose";
import { iBooks } from "../types/api";

const bookSchema = new Schema<iBooks>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },

    author: {
      type: String,
      required: [true, "Author is required"],
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      minlength: 4,
    },

    genre: {
      type: String,
      required: [true, "Year is required"],
    },
  },
  {
    timestamps: true,
  },
);
const Book: Model<iBooks> =
  mongoose.models.Book || mongoose.model<iBooks>("Book", bookSchema);

export default Book;

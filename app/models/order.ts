import mongoose, { Schema, Model } from "mongoose";
import { iOrder } from "../types/api";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "OrderItem",
      required: true,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);
const Book: Model<iOrder> =
  mongoose.models.Order || mongoose.model<iOrder>("Order", orderSchema);

export default Book;

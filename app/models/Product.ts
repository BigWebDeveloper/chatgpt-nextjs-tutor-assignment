import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: "String",
      required: true,
      trim: true,
    },
    price: {
      type: "Number",
      required: true,
      min: 0,
    },
    category: {
      type: "String",
      required: true,
      trim: true,
    },
    description: {
      type: "String",
      required: false,
      default: "",
    },
    inStock: {
      type: "Boolean",
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

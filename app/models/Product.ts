import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negetive"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product descritption is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product creator is required"],
      index: true,
    },
  },
  { timestamps: true },
);

productSchema.index({
  category: 1,
  price: 1,
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

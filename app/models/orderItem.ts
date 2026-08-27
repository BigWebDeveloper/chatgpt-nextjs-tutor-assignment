import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem extends Document {
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    price: {
      type: Number,
      requqired: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem ||
  mongoose.model<IOrderItem>("OrderItem", orderItemSchema);

export default OrderItem;

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    //   order: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Order",
    //     required: [true, "Order is required"],
    //     index: true,
    //   },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be a positive number"],
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

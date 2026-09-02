import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Order from "@/app/models/order";
import { handleError } from "@/app/lib/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await connectDB();
    const { userId } = await params;
    console.log(userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json(
        { error: "Invalid User ID format" },
        { status: 400 },
      );
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate("user", "name email")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image category",
        },
      })
      .sort({ createdAt: -1 });

    if (!orders) {
      return Response.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({ orders });
  } catch (error) {
    handleError(error);
  }
}

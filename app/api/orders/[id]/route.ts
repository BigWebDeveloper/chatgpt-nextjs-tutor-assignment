import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Order from "@/app/models/order";
import { handleError } from "@/app/lib/error-handler";
import { RouteContext } from "@/app/types/api";
import { getAuthenticatedUser } from "@/app/lib/auth";

export async function GET(request: Request, context: RouteContext) {
  try {
    await connectDB();

    /* Authenticate */

    const user = await getAuthenticatedUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * -----------------------------------------------
     * Get order ID
     * -----------------------------------------------
     */

    const { id } = await context.params;
    console.log(id);

    /*
     * -----------------------------------------------
     * Validate MongoDB ObjectId
     * -----------------------------------------------
     */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid User ID format" },
        { status: 400 },
      );
    }

    /*
     * -----------------------------------------------
     * Find order belonging to this user
     * -----------------------------------------------
     */

    const order = await Order.find({
      _id: id,
      user: user.userId,
    })
      .populate({
        path: "items",
        populate: {
          path: "product",
        },
      })
      .lean();

    /*
     * We intentionally use "Order not found".
     *
     * We don't reveal whether an order exists
     * for another user.
     */

    if (!order) {
      return Response.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json({
      success: true,
      data: order,
    });
  } catch (error) {
    handleError(error);
  }
}

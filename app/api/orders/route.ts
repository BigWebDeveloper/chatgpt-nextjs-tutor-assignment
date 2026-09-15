import { createOrderController } from "@/app/controllers/order.controller";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { handleError } from "@/app/lib/error-handler";
import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/models/order";

export async function POST(request: Request) {
  return await createOrderController(request);
}

export async function GET() {
  try {
    await connectDB();
    /* Authenticate use */

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
     * Only retrieve this user's orders.
     */

    const orders = await Order.find({
      user: user.userId,
    })
      .populate({
        path: "items",
        populate: {
          path: "product",
        },
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    return Response.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return handleError(error);
  }
}

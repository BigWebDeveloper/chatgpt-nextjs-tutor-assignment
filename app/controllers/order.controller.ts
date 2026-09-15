import { createOrderSchema } from "../lib/zod/validations/order";
import { createOrderService } from "../services/order.service";
import { getAuthenticatedUser } from "../lib/auth";
import { connectDB } from "../lib/mongodb";

export async function createOrderController(request: Request) {
  // 1. MUST await database connection first
  await connectDB();
  try {
    /*
     * -----------------------------------------------
     * Authenticate
     * -----------------------------------------------
     */

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
     * Parse JSON
     * -----------------------------------------------
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * -----------------------------------------------
     * Validate
     * -----------------------------------------------
     */

    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    /*
     * -----------------------------------------------
     * Create order
     * -----------------------------------------------
     */

    const resultFromService = await createOrderService(
      user.userId,
      result.data,
    );

    return Response.json(
      {
        success: resultFromService.success,
        message: resultFromService.message,
        ...(resultFromService.data && {
          data: resultFromService.data,
        }),
      },
      {
        status: resultFromService.status,
      },
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to create order",
      },
      {
        status: 500,
      },
    );
  }
}

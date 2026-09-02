import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import { requireAdmin, requireAdminAndUserAccess } from "@/app/lib/auth";
import mongoose from "mongoose";
import Order from "@/app/models/order";
import { updateUserVerify } from "@/app/lib/zod/authVerify";
import { handleError } from "@/app/lib/error-handler";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;
//   return Response.json({ message: "User found", id: id });
// }

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid User ID format" }, { status: 400 });
  }

  // const user = await User.findById(id);

  const user = await Order.findById({
    user: id,
  });

  if (!user) {
    return Response.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      },
    );
  }
  return Response.json(user);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const { error } = await requireAdminAndUserAccess(id);

    if (error === "unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error === "forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const result = updateUserVerify(body);

    if (!result.success) {
      return Response.json(
        {
          error: result.error,
        },
        {
          status: 400,
        },
      );
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid User ID format" },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, result.data, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return Response.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
      success: true,
      message: `User updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { error } = await requireAdmin();

    if (error === "unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error === "forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid User ID format" },
        { status: 400 },
      );
    }
    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return Response.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
      message: `User deleted successfully`,
    });
  } catch (error) {
    handleError(error);
  }
}

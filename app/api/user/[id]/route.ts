import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Order from "@/app/models/order";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid User ID format" }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    returnDocument: "after",
    runValidators: true,
  });

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
    message: `User ${id} updated successfully`,
    updatedData: updatedUser,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid User ID format" }, { status: 400 });
  }

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
    message: `User ${id} deleted successfully`,
  });
}

import Product from "@/app/models/Product";
import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid User ID format" }, { status: 400 });
  }

  const product = await Product.findById(id);

  if (!product) {
    return Response.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      },
    );
  }
  return Response.json(product);
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

  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updatedProduct) {
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
    updatedData: updatedProduct,
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

  const updatedProduct = await Product.findByIdAndDelete(id);

  if (!updatedProduct) {
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

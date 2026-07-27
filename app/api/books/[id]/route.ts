import Book from "@/app/models/Books";
import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid Book ID format" }, { status: 400 });
  }
  console.log(id);
  const book = await Book.findById(id);

  if (!book) {
    return Response.json(
      {
        error: "Book not found",
      },
      {
        status: 404,
      },
    );
  }
  return Response.json(book);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid Book ID format" }, { status: 400 });
  }

  const updatedBook = await Book.findByIdAndUpdate(id, body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updatedBook) {
    return Response.json(
      {
        error: "Book not found",
      },
      {
        status: 404,
      },
    );
  }

  return Response.json(
    {
      message: `Book ${id} updated successfully`,
      updatedData: updatedBook,
    },
    { status: 201 },
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return Response.json({
    message: `Book ${id} deleted successfully`,
    deletedData: body,
  });
}

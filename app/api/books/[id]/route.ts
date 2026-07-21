import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const book = User.findById(id);

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
  const { id } = await params;
  const body = await request.json();

  return Response.json({
    message: `Book ${id} updated successfully`,
    updatedData: body,
  });
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

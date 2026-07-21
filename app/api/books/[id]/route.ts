import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";

// const books = [
//   {
//     id: 1,
//     title: "Atomic Habits",
//     author: "James Clear",
//     year: 2018,
//     genre: "Self-Help",
//   },
//   {
//     id: 2,
//     title: "The Alchemist",
//     author: "Paulo Coelho",
//     year: 1988,
//     genre: "Fiction",
//   },
//   {
//     id: 3,
//     title: "Rich Dad Poor Dad",
//     author: "Robert T. Kiyosaki",
//     year: 1997,
//     genre: "Personal Finance",
//   },
//   {
//     id: 4,
//     title: "Clean Code",
//     author: "Robert C. Martin",
//     year: 2008,
//     genre: "Programming",
//   },
//   {
//     id: 5,
//     title: "The Pragmatic Programmer",
//     author: "Andrew Hunt & David Thomas",
//     year: 1999,
//     genre: "Programming",
//   },
//   {
//     id: 6,
//     title: "The Psychology of Money",
//     author: "Morgan Housel",
//     year: 2020,
//     genre: "Finance",
//   },
//   {
//     id: 7,
//     title: "Deep Work",
//     author: "Cal Newport",
//     year: 2016,
//     genre: "Productivity",
//   },
//   {
//     id: 8,
//     title: "Think and Grow Rich",
//     author: "Napoleon Hill",
//     year: 1937,
//     genre: "Personal Development",
//   },
//   {
//     id: 9,
//     title: "Zero to One",
//     author: "Peter Thiel",
//     year: 2014,
//     genre: "Business",
//   },
//   {
//     id: 10,
//     title: "The Lean Startup",
//     author: "Eric Ries",
//     year: 2011,
//     genre: "Business",
//   },
// ];

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

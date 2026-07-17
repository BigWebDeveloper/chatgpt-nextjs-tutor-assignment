const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    genre: "Self-Help",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    year: 1988,
    genre: "Fiction",
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    year: 1997,
    genre: "Personal Finance",
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    year: 2008,
    genre: "Programming",
  },
  {
    id: 5,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    year: 1999,
    genre: "Programming",
  },
  {
    id: 6,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    year: 2020,
    genre: "Finance",
  },
  {
    id: 7,
    title: "Deep Work",
    author: "Cal Newport",
    year: 2016,
    genre: "Productivity",
  },
  {
    id: 8,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    year: 1937,
    genre: "Personal Development",
  },
  {
    id: 9,
    title: "Zero to One",
    author: "Peter Thiel",
    year: 2014,
    genre: "Business",
  },
  {
    id: 10,
    title: "The Lean Startup",
    author: "Eric Ries",
    year: 2011,
    genre: "Business",
  },
];

export async function POST(request: Request) {
  const body = await request.json();

  const missing = ["title", "author", "year", "genre"].filter(
    (field) => !body[field],
  );

  if (missing.length > 0) {
    return Response.json(
      {
        error: "Bad Request",
        message: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    );
  }
  const newBook = { ...body, id: books.length + 1 };
  books.push(newBook);
  return Response.json(
    { message: "Book added successfully", book: newBook },
    { status: 201 },
  );
}

export async function GET() {
  return Response.json({ books, status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;
  const missing = ["name", "email", "password"].filter((field) => !body[field]);

  if (missing.length > 0) {
    return Response.json(
      {
        error: "Bad Request",
        message: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    );
  }

  return Response.json(
    {
      message: "User registered successfully",
      user: { name, email, password },
    },
    { status: 201 },
  );
}

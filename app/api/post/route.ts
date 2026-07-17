export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.email) {
    return Response.json(
      {
        error: "Name and email are required",
      },
      {
        status: 400,
      },
    );
  }

  return Response.json(
    {
      message: "User created successfully!",
      user: body,
    },
    {
      status: 201,
    },
  );
}

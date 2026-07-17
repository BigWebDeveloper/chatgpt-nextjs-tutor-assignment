export async function GET() {
  const products = ["oranges", "apples", "bananas"];

  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.price) {
    return Response.json(
      {
        error: "name and price",
      },
      { status: 400 },
    );
  }

  return Response.json(
    {
      message: "Product created successfully",
      product: body,
    },
    { status: 200 },
  );
}

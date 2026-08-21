import Product from "@/app/models/Product";
import { connectDB } from "@/app/lib/mongodb";

export async function GET() {
  await connectDB();

  const product = await Product.find();

  if (!product) {
    return Response.json({ error: "Product is empty" }, { status: 400 });
  }

  return Response.json(product, { status: 200 });
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();

  console.log(body);

  if (Array.isArray(body)) {
    const requiredFields = [
      "name",
      "price",
      "category",
      "description",
      "inStock",
    ];
    if (body.length === 0) {
      return Response.json(
        { error: "Product list cannot be empty" },
        { status: 400 },
      );
    }

    // Validate every item in the array
    for (let i = 0; i < body.length; i++) {
      const missing = requiredFields.filter(
        (field) => body[i][field] === undefined || body[i][field] === null,
      );
      if (missing.length > 0) {
        return Response.json(
          {
            error: `Item at index ${i} is missing fields: ${missing.join(", ")}`,
          },
          { status: 400 },
        );
      }
    }

    // Bulk insert into MongoDB
    const products = await Product.insertMany(body);

    return Response.json(
      {
        message: `${products.length} products created successfully`,
        products,
      },
      { status: 201 },
    );
  }

  const missing = [
    "name",
    "price",
    "category",
    "description",
    "inStock",
  ].filter((field) => !body[field]);

  if (missing.length > 0) {
    return Response.json(
      {
        error: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const product = await Product.create(body);

  return Response.json(
    {
      message: "Product created successfully",
      product: product,
    },
    { status: 200 },
  );
}

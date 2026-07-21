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

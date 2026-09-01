import Product from "@/app/models/Product";
import { connectDB } from "@/app/lib/mongodb";
import { handleError } from "@/app/lib/error-handler";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const sortParam = searchParams.get("sort");

    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // ``````````dynamic sorting````````````````
    let sort: Record<string, 1 | -1> = {};

    // Fall back to a default sort if the param is missing or invalid
    const allowedFields = ["price", "name", "createdAt"];

    if (sortParam) {
      const [field, direction] = sortParam.split("_");

      // Verify the field is inside the allowed whitelist
      if (allowedFields.includes(field)) {
        sort[field] = direction === "desc" ? -1 : 1;
      }
    }

    // Default to newest items if sort is invalid or omitted
    if (Object.keys(sort).length === 0) {
      sort = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    if (Array.isArray(body)) {
      const requiredFields = [
        "name",
        "description",
        "price",
        "category",
        "image",
        "inStock",
        "createdBy",
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

    console.log("not an array");

    const missing = [
      "name",
      "description",
      "price",
      "category",
      "image",
      "inStock",
      "createdBy",
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
        success: true,
        message: "Product created successfully",
        product: product,
      },
      { status: 200 },
    );
  } catch (error) {
    handleError(error);
  }
}

import { handleError } from "@/app/lib/error-handler";
import Product from "@/app/models/Product";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const sortParam = searchParams.get("sort");

    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

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
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: "createdBy", select: "name price" }),

      Product.countDocuments(filter),
    ]);

    return Response.json(
      {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = Number(searchParams.get("page"));
//     const limit = Number(searchParams.get("limit"));

//     console.log(page, limit);

//     const category = searchParams.get("category");

//     const filter: Record<string, unknown> = {};
//     if (category) {
//       filter.category = category;
//     }

//     //     if (search) {
//     //       filter.name = {
//     //         $regex: search,
//     //         $options: "i",
//     //       };
//     //     }
//     //     const products = await Product.find(filter);

//     const skip = (page - 1) * limit;

//     const products = await Product.find(filter).skip(skip).limit(limit);

//     return Response.json({ products }, { status: 200 });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get("category");
//     const search = searchParams.get("search");

//     const filter: Record<string, unknown> = {};
//     if (category) {
//       filter.category = category;
//     }

//     if (search) {
//       filter.name = {
//         $regex: search,
//         $options: "i",
//       };
//     }
//     const products = await Product.find(filter);

//     return Response.json({ products }, { status: 200 });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get("category");
//     const sort = searchParams.get("sort");
//     const search = searchParams.get("search");

//     return Response.json({ category, sort, search }, { status: 200 });
//   } catch (error) {
//     return handleError(error);
//   }
// }

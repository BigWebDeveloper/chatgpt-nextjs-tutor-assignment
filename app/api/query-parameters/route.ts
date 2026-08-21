import { handleError } from "@/app/lib/error-handler";
import Product from "@/app/models/Product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
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

    const skip = (page - 1) * limit;

    const products = await Product.find(filter).skip(skip).limit(limit);

    return Response.json({ products }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
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

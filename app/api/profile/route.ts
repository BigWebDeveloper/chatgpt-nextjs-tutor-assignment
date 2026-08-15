import { connectDB } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
// import { authorize } from "@/app/lib/loginAuth";

export async function GET() {
  // const user = authorize(request);

  // if (user.role !== "admin") {
  //   return Response.json({ error: "Forbidden" }, { status: 403 });
  // }
  await connectDB();

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const payload = verifyToken(token);
    // if (user.role !== "admin") {
    //   return Response.json({ error: "Forbidden" }, { status: 403 });
    // }

    return Response.json(
      { message: "Welcome!", user: payload },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

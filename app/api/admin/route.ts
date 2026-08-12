import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { authorize } from "@/app/lib/loginAuth";

export async function GET(request: Request) {
  try {
    const user = authorize(request);

    if (user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const allUser = await User.find();

    return Response.json(
      {
        message: "Welcome!",
        users: allUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile API error:", error);

    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

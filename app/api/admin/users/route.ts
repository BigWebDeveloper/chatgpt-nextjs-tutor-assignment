import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { requireAdmin } from "@/app/lib/auth";

export async function GET() {
  await connectDB();
  try {
    const { user, error } = await requireAdmin();

    if (error) {
      return error;
    }

    console.log(user?.role);
    await connectDB();

    const allUser = await User.find();

    return Response.json(
      {
        message: "Admin access granted",
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

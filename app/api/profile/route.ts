import { connectDB } from "@/app/lib/mongodb";
import { requireAdmin } from "@/app/lib/auth";

export async function GET() {
  await connectDB();

  try {
    const { user, error } = await requireAdmin();

    if (error) {
      return error;
    }

    console.log(user?.role);

    return Response.json({ message: "Welcome!", user: user }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

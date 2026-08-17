import { connectDB } from "@/app/lib/mongodb";
import { requireAdmin } from "@/app/lib/auth";

export async function GET() {
  await connectDB();

  try {
    const { user, error } = await requireAdmin();

    if (error === "unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error === "forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
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

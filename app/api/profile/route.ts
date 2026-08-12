import { connectDB } from "@/app/lib/mongodb";
import { authorize } from "@/app/lib/loginAuth";

export async function GET(request: Request) {
  const user = authorize(request);

  if (user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();

  try {
    if (user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ message: "Welcome!", user: user }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

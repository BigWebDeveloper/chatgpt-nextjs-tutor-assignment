import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  console.log(authHeader);
  await connectDB();

  if (!authHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const currentUser = await User.findOne({
      email: "azeez.ishola1297@gmail.com",
    });

    return Response.json({ message: currentUser, decoded }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

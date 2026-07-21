import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { generateToken } from "@/app/lib/jwt";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const missing = ["email", "password"].filter((field) => !body[field]);

  if (missing.length > 0) {
    return Response.json(
      {
        error: "Bad Request",
        message: `Missing fields: ${missing.join(", ")}`,
      },
      { status: 400 },
    );
  }

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: "Invalid email" }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }
  const token = generateToken(user);

  return Response.json({ message: "Login successful", token }, { status: 200 });
}

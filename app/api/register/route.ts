import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;
  const missing = ["name", "email", "password"].filter((field) => !body[field]);

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

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Response.json({ error: "Email already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return Response.json(
    {
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    },
    { status: 201 },
  );
}

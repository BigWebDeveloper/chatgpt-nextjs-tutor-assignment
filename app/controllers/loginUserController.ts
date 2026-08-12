import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/app/lib/jwt";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function loginUser(request: Request) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData) as {
    email: string;
    password: string;
  };

  const missing = ["email", "password"].filter((field) => !formData.get(field));

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

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  return Response.json({ message: "Login successful", token }, { status: 200 });
}

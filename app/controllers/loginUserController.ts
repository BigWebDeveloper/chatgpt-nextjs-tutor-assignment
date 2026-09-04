import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";
import { rateLimit } from "@/app/lib/rate-limit";

export async function loginUser(request: Request) {
  // 1. Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const limit = rateLimit(`login:${ip}`, 5, 60_000);

  if (!limit.success) {
    return Response.json(
      {
        success: false,
        message: "Too many login attempts. Try again later.",
      },
      {
        status: 429,
      },
    );
  }

  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData) as {
    email: string;
    password: string;
  };

  console.log(email, password);
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

  const cookieStore = await cookies();

  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return Response.json({ message: "Login successful", token }, { status: 200 });
}

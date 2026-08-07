import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { registerSchema } from "../lib/validations/auth";

export async function registerUser(request: Request) {
  const body = await request.json();
  const bodyValidate = registerSchema.safeParse(body);
  const { name, email, password, role } = body;

  if (!bodyValidate.success) {
    return Response.json(
      {
        error: "Bad Request",
        message: bodyValidate.error.flatten(),
      },
      {
        status: 400,
      },
    );
  }

  const missing = ["name", "email", "password"].filter((field) => !body[field]);

  if (missing.length > 0) {
    return Response.json(
      {
        error: "Bad Request",
        message: `Missing fields: ${missing.join(", ")}`,
      },
      {
        status: 400,
      },
    );
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Response.json(
      {
        error: "Email already exists",
      },
      {
        status: 409,
      },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return Response.json(
    {
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    {
      status: 201,
    },
  );
}

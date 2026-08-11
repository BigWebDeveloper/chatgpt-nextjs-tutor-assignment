import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
export async function registerUser(request: Request) {
  const formData = await request.formData();

  console.log("Request body:", Object.fromEntries(formData));
  const { name, email, password, role } = Object.fromEntries(formData) as {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  };

  console.log("Request body:", Object.fromEntries(formData));

  const missing = ["name", "email", "password"].filter(
    (field) => !formData.get(field),
  );

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

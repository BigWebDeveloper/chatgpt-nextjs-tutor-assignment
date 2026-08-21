import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import { authVerify } from "../lib/zod/authVerify";
import bcrypt from "bcryptjs";
import { registerUser } from "../services/auth.service";

export async function registerT(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  console.log("Request body:", data);

  const { name, email, password, role } = data as {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  };

  const result = authVerify(data);

  if (!result.success) {
    return Response.json(
      {
        error: result.error,
      },
      {
        status: 400,
      },
    );
  }

  console.log("Request body:", Object.fromEntries(formData));

  await connectDB();

  const user = await registerUser(name, email, password, role);

  // const existingUser = await User.findOne({ email });

  // if (existingUser) {
  //   return Response.json(
  //     {
  //       error: "Email already exists",
  //     },
  //     {
  //       status: 409,
  //     },
  //   );
  // }

  // const hashedPassword = await bcrypt.hash(password, 10);

  // const user = await User.create({
  //   name,
  //   email,
  //   password: hashedPassword,
  //   role,
  // });

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

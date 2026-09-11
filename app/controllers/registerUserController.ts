import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import { authVerify } from "../lib/zod/authVerify";
import { hashedPassword } from "../lib/bcrypt";

export async function registerUserController(request: Request) {
  const contentType = request.headers.get("content-type");
  let data: Record<string, unknown>;

  // JSON
  if (contentType?.includes("application/json")) {
    data = await request.json();
  }

  // multipart/form-data
  else if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries());
  }

  // Unsupported body
  else {
    return Response.json(
      { success: false, error: "Unsupported content type" },
      { status: 415 },
    );
  }

  const { name, email, password, role } = data as {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  };

  const result = authVerify(data);

  if (result.error) {
    return result.error;
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const passwordHash = await hashedPassword(password);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
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

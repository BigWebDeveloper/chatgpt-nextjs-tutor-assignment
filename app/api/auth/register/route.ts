import { handleError } from "@/app/lib/error-handler";
import { authVerify } from "@/app/lib/zod/authVerify";
import { connectDB } from "@/app/lib/mongodb";
import { registerUser } from "@/app/services/auth.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data = Object.fromEntries(formData.entries());

    // console.log("Request body:", data);

    const { name, email, password, role } = data as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
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

    await connectDB();

    const user = await registerUser(name, email, password, role);

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
  } catch (error) {
    return handleError(error);
  }
}

import { handleError } from "@/app/lib/error-handler";
import { registerUser } from "@/app/controllers/registerUserController";

export async function POST(request: Request) {
  try {
    return await registerUser(request);
  } catch (error) {
    return handleError(error);
  }
}

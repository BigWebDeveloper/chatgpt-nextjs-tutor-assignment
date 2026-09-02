import { handleError } from "@/app/lib/error-handler";
import { loginUser } from "@/app/controllers/loginUserController";

export async function POST(request: Request) {
  try {
    return await loginUser(request);
  } catch (error) {
    return handleError(error);
  }
}

import { handleError } from "@/app/lib/error-handler";
import { loginUserController } from "@/app/controllers/loginUserController";

export async function POST(request: Request) {
  try {
    return await loginUserController(request);
  } catch (error) {
    return handleError(error);
  }
}

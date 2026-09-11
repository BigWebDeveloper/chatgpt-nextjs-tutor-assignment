import { handleError } from "@/app/lib/error-handler";
import { registerUserController } from "@/app/controllers/registerUserController";

export async function POST(request: Request) {
  try {
    return await registerUserController(request);
  } catch (error) {
    return handleError(error);
  }
}

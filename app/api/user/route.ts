import { connectDB } from "@/app/lib/mongodb";
import Users from "@/app/models/User";

export async function GET() {
  await connectDB();
  const user = await Users.find();

  return Response.json(user, { status: 201 });
}

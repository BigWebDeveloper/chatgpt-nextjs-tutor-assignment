import { connectDB } from "@/app/lib/mongodb";
import Users from "@/app/models/User";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();

  const user = await Users.create(body);

  return Response.json(user, { status: 201 });
}

export async function GET() {
  await connectDB();

  const user = await Users.find();

  return Response.json(user, { status: 201 });
}

import bcrypt from "bcryptjs";
import User from "../models/User";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "user" | "admin",
) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
}

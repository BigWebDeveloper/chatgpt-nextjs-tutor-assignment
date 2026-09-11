import bcrypt from "bcryptjs";

export async function hashedPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

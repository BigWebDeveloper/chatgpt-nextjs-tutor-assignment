export async function GET() {
  const users = {
    name: "Your Name",
    skill: "Frontend Developer",
    goal: "Backend Developer",
  };

  return Response.json(users);
}

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;
//   return Response.json({ message: "User found", id: id });
// }

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Mike" },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    return Response.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      },
    );
  }
  return Response.json(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return Response.json({
    message: `User ${id} updated successfully`,
    updatedData: body,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return Response.json({
    message: `User ${id} deleted successfully`,
    deletedData: body,
  });
}

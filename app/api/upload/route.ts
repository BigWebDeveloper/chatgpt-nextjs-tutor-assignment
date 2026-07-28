import { handleError } from "@/app/lib/error-handler";
import cloudinary from "@/app/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return Response.json(
        { message: "No file provided under key 'image'" },
        { status: 400 },
      );
    }

    // Convert file to Node.js Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(buffer);

    // Upload buffer directly to Cloudinary using upload_stream
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "uploads" }, // Optional: specify a folder in Cloudinary
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve(result);
        },
      );

      uploadStream.end(buffer);
    });

    return Response.json(
      {
        message: "Uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
        file: result,
      },
      { status: 201 },
    );
  } catch (error) {
    handleError(error);
    return Response.json({ message: "Upload failed" }, { status: 500 });
  }
}

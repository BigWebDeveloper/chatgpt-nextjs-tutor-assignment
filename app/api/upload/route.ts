import { handleError } from "@/app/lib/error-handler";
import cloudinary from "@/app/lib/cloudinary";
import { connectDB } from "@/app/lib/mongodb";
import { UploadApiResponse } from "cloudinary";
import Song from "@/app/models/Songs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { image, title, artist } = Object.fromEntries(formData) as {
      image: File | null;
      title: string | null;
      artist: string | null;
    };

    console.log("RECEIVED:", {
      title: formData.get("title"),
      artist: formData.get("artist"),
      image: formData.get("image"),
    });

    console.log(image);

    if (!image) {
      return Response.json(
        { message: "No file provided under key 'image'" },
        { status: 400 },
      );
    }

    if (!title || !artist) {
      return Response.json(
        { error: "Title and artist are required" },
        { status: 400 },
      );
    }
    await connectDB();

    const existingSong = await Song.findOne({ title, artist });

    if (existingSong) {
      return Response.json(
        {
          error: "Song already exists",
        },
        {
          status: 409,
        },
      );
    }

    // Convert image to Node.js Buffer
    const bytes = await image.arrayBuffer();
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

    const newSong = await Song.create({
      title: title!,
      artist: artist!,
      coverImage: result.secure_url,
    });

    return Response.json(
      {
        message: "Uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
        image: result,
        song: newSong,
      },
      { status: 201 },
    );
  } catch (error) {
    handleError(error);
    return Response.json({ message: "Upload failed" }, { status: 500 });
  }
}

import mongoose, { Schema, Model } from "mongoose";
import { iSong } from "../types/api";

const SongSchema = new Schema<iSong>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

// Prevents duplicate songs by the same artist at the DB level
SongSchema.index({ title: 1, artist: 1 }, { unique: true });

const Song: Model<iSong> =
  mongoose.models.Song || mongoose.model<iSong>("Song", SongSchema);

export default Song;

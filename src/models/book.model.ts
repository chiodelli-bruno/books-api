import mongoose, { Schema } from "mongoose"
import type { IBookDocument } from "../interfaces/book.interface"

const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, "El autor es obligatorio"],
      trim: true,
    },
    publishedYear: {
      type: Number,
      validate: {
        validator: (value: number) => value > 0 && value <= new Date().getFullYear(),
        message: "El año de publicación debe ser válido",
      },
    },
    genre: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default mongoose.model<IBookDocument>("Book", BookSchema)

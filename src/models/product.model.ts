import mongoose, { Schema } from "mongoose"
import type { IProductDocument } from "../interfaces/product.interface"

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      enum: {
        values: ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros", "Juguetes", "Salud", "Otros"],
        message: "La categoría seleccionada no es válida",
      },
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)


ProductSchema.index({ name: "text", description: "text" })

export default mongoose.model<IProductDocument>("Product", ProductSchema)

import mongoose, { Schema } from "mongoose"
import type { IVolunteerDocument } from "../interfaces/volunteer.interface"

const VolunteerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor ingresa un email válido"],
    },
    activity: {
      type: String,
      required: [true, "La actividad es obligatoria"],
      trim: true,
      enum: {
        values: [
          "Educación",
          "Salud",
          "Medio Ambiente",
          "Asistencia Social",
          "Deportes",
          "Cultura",
          "Tecnología",
          "Otros",
        ],
        message: "La actividad seleccionada no es válida",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default mongoose.model<IVolunteerDocument>("Volunteer", VolunteerSchema)

import mongoose from "mongoose"

export const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri)
    console.log("Conexión a MongoDB establecida")
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error)
    process.exit(1)
  }
}

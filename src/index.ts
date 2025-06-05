import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import bookRoutes from "./routes/bookRoutes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/books-api"


app.use(helmet())
app.use(cors())
app.use(express.json())


app.use("/books", bookRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de Libros",
    endpoints: {
      getAllBooks: "GET /books",
      getBookById: "GET /books/:id",
      createBook: "POST /books",
      updateBook: "PATCH /books/:id",
      deleteBook: "DELETE /books/:id",
    },
  })
})

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" })
})

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB")
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error)
    process.exit(1)
  })

export default app

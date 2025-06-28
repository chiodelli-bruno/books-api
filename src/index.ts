import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import productRoutes from "./routes/productRoutes"


dotenv.config()


const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/products-app"


app.use(helmet())
app.use(cors())
app.use(express.json())


const publicPath = path.join(__dirname, "../public")
console.log("📁 Ruta de archivos estáticos:", publicPath)

app.use(express.static(publicPath))


app.get("/test", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente", timestamp: new Date() })
})


app.use("/api/products", productRoutes)


app.get("/api", (req, res) => {
  res.json({
    message: "API de Productos - CRUD con Búsqueda",
    version: "1.0.0",
    publicPath: publicPath,
    endpoints: {
      products: {
        getAll: "GET /api/products",
        search: "GET /api/products/search?q=nombre",
        getById: "GET /api/products/:id",
        create: "POST /api/products",
        update: "PATCH /api/products/:id",
        delete: "DELETE /api/products/:id",
        categories: "GET /api/products/categories",
      },
    },
  })
})


app.get("/", (req, res) => {
  const indexPath = path.join(publicPath, "index.html")
  console.log("🏠 Intentando servir:", indexPath)


  const fs = require("fs")
  if (fs.existsSync(indexPath)) {
    console.log("✅ Archivo index.html encontrado")
    res.sendFile(indexPath)
  } else {
    console.log("❌ Archivo index.html NO encontrado")
    res.status(404).send(`
      <h1>Error: Archivo no encontrado</h1>
      <p>Buscando en: ${indexPath}</p>
      <p>Verifica que el archivo public/index.html existe</p>
    `)
  }
})


app.use((req, res) => {
  console.log("🔍 Ruta no encontrada:", req.path)
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.path}`,
  })
})


mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB")
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📚 API disponible en http://localhost:${PORT}/api`)
      console.log(`🌐 Frontend disponible en http://localhost:${PORT}`)
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`)
    })
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error)
   
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo SIN MongoDB en http://localhost:${PORT}`)
      console.log(`🌐 Frontend disponible en http://localhost:${PORT}`)
    })
  })

export default app

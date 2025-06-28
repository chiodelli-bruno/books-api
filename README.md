# 🛍️ Gestión de Productos - CRUD con Búsqueda

Una aplicación web completa para la gestión de productos con funcionalidad de búsqueda avanzada, desarrollada con Node.js, Express, TypeScript, MongoDB y JavaScript vanilla, siguiendo el patrón de diseño MVC.

## ✨ Características Principales

### 🔍 Funcionalidad de Búsqueda (Nueva)
- **Búsqueda en tiempo real** por nombre y descripción de productos
- **Búsqueda parcial** e insensible a mayúsculas/minúsculas
- **Filtros avanzados** por categoría y rango de precios
- **Resultados dinámicos** que se actualizan mientras escribes
- **Debounce** para optimizar las consultas a la API

### 📦 Gestión de Productos
- Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar)
- Validación de datos en frontend y backend
- Manejo de imágenes mediante URLs
- Control de stock y disponibilidad
- Categorización de productos

### 🎨 Interfaz de Usuario
- Diseño moderno y responsive
- Validación de formularios en tiempo real
- Notificaciones toast para feedback del usuario
- Modales de confirmación para acciones críticas
- Estados de carga y manejo de errores
- Animaciones suaves y transiciones

### 🏗️ Arquitectura
- Estructura organizada siguiendo el patrón MVC
- API RESTful con endpoints bien definidos
- Separación clara entre frontend y backend
- Manejo centralizado de errores
- Variables de entorno para configuración

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Helmet** - Seguridad HTTP
- **CORS** - Manejo de políticas de origen cruzado
- **Dotenv** - Variables de entorno

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Lógica del cliente
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía (Inter)

## 📁 Estructura del Proyecto

\`\`\`
proyecto/
├── src/                          # Código fuente del backend
│   ├── controllers/              # Controladores (lógica de negocio)
│   │   ├── product.controller.ts # Controlador de productos
│   │   └── volunteer.controller.ts
│   ├── models/                   # Modelos de datos (Mongoose)
│   │   ├── product.model.ts      # Modelo de producto
│   │   └── volunteer.model.ts
│   ├── routes/                   # Definición de rutas
│   │   ├── productRoutes.ts      # Rutas de productos
│   │   └── volunteerRoutes.ts
│   ├── interfaces/               # Interfaces TypeScript
│   │   ├── product.interface.ts  # Interfaces de producto
│   │   └── volunteer.interface.ts
│   ├── config/                   # Configuración
│   │   └── database.ts           # Configuración de MongoDB
│   ├── utils/                    # Utilidades
│   │   └── errorHandler.ts       # Manejo de errores
│   └── index.ts                  # Punto de entrada del servidor
├── public/                       # Archivos estáticos del frontend
│   ├── index.html               # Página principal
│   ├── styles.css               # Estilos CSS
│   ├── script.js                # Lógica JavaScript
│   └── test.html                # Página de pruebas
├── dist/                        # Código compilado (generado)
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables de entorno
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración TypeScript
├── vercel.json                  # Configuración para despliegue
└── README.md                    # Este archivo
\`\`\`

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (v16 o superior)
- **MongoDB** (local o MongoDB Atlas)
- **npm** o **yarn**

### 1. Clonar el Repositorio
\`\`\`bash
git clone https://github.com/chiodelli-bruno/books-api
cd gestion-productos
\`\`\`

### 2. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno
\`\`\`bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus configuraciones
\`\`\`

**Contenido del archivo `.env`:**
\`\`\`env
# Puerto del servidor
PORT=3000

# Base de datos MongoDB
# Para MongoDB local:
MONGODB_URI=mongodb://localhost:27017/products-app
# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/products-app

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:3000

# Entorno de desarrollo
NODE_ENV=development
\`\`\`

### 4. Compilar el Proyecto
\`\`\`bash
npm run build
\`\`\`

### 5. Ejecutar la Aplicación

**Modo Desarrollo (con recarga automática):**
\`\`\`bash
npm run dev
\`\`\`

**Modo Producción:**
\`\`\`bash
npm start
\`\`\`

### 6. Acceder a la Aplicación
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Documentación API:** http://localhost:3000/api

## 📚 API Endpoints

### Productos

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/api/products` | Obtener todos los productos | `?search=texto&category=cat&minPrice=0&maxPrice=100` |
| `GET` | `/api/products/search` | Búsqueda específica | `?q=término_búsqueda` |
| `GET` | `/api/products/categories` | Obtener categorías disponibles | - |
| `GET` | `/api/products/:id` | Obtener producto por ID | - |
| `POST` | `/api/products` | Crear nuevo producto | Body: JSON |
| `PATCH` | `/api/products/:id` | Actualizar producto | Body: JSON |
| `DELETE` | `/api/products/:id` | Eliminar producto | - |

### Modelo de Datos: Producto

\`\`\`typescript
interface IProduct {
  name: string          // Nombre del producto (requerido, único)
  description: string   // Descripción (requerido)
  price: number        // Precio (requerido, >= 0)
  category: string     // Categoría (requerido)
  stock: number        // Stock disponible (requerido, >= 0)
  available: boolean   // Disponibilidad (default: true)
  imageUrl?: string    // URL de imagen (opcional)
  createdAt: Date      // Fecha de creación (automático)
  updatedAt: Date      // Fecha de actualización (automático)
}
\`\`\`

### Categorías Disponibles
- Electrónicos
- Ropa
- Hogar
- Deportes
- Libros
- Juguetes
- Salud
- Otros

## 🔍 Funcionalidad de Búsqueda

### Búsqueda Simple
\`\`\`bash
# Buscar productos que contengan "laptop" en nombre o descripción
GET /api/products/search?q=laptop
\`\`\`

### Búsqueda con Filtros
\`\`\`bash
# Buscar productos con múltiples filtros
GET /api/products?search=smartphone&category=Electrónicos&maxPrice=1000
\`\`\`

### Características de la Búsqueda
- **Insensible a mayúsculas/minúsculas:** "LAPTOP" = "laptop" = "Laptop"
- **Búsqueda parcial:** "lap" encuentra "laptop"
- **Múltiples campos:** Busca en nombre Y descripción
- **Tiempo real:** Resultados mientras escribes (con debounce de 300ms)
- **Combinable con filtros:** Categoría + rango de precios

## 💡 Ejemplos de Uso

### 1. Crear un Producto
\`\`\`bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Smartphone Apple con chip A17 Pro",
    "price": 999.99,
    "category": "Electrónicos",
    "stock": 50,
    "available": true,
    "imageUrl": "https://example.com/iphone15.jpg"
  }'
\`\`\`

### 2. Buscar Productos
\`\`\`bash
# Búsqueda simple
curl "http://localhost:3000/api/products/search?q=iPhone"

# Búsqueda con filtros
curl "http://localhost:3000/api/products?search=smartphone&category=Electrónicos&maxPrice=1000"
\`\`\`

### 3. Obtener Todos los Productos
\`\`\`bash
curl http://localhost:3000/api/products
\`\`\`

### 4. Actualizar un Producto
\`\`\`bash
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99,
    "stock": 45
  }'
\`\`\`

### 5. Eliminar un Producto
\`\`\`bash
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID
\`\`\`

## 🧪 Testing y Desarrollo

### Scripts Disponibles
\`\`\`bash
# Desarrollo con recarga automática
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start

# Linting (si está configurado)
npm run lint
\`\`\`

### Páginas de Prueba
- **Principal:** http://localhost:3000
- **Test:** http://localhost:3000/test.html
- **API Info:** http://localhost:3000/api

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. El archivo `vercel.json` ya está configurado

### Variables de Entorno para Producción
\`\`\`env
\`\`\`

## 🔧 Personalización

### Agregar Nuevas Categorías
Editar en `src/models/product.model.ts`:
\`\`\`typescript
enum: {
  values: ["Electrónicos", "Ropa", "Hogar", "TU_NUEVA_CATEGORIA"],
  message: "La categoría seleccionada no es válida",
}
\`\`\`

### Modificar Campos de Búsqueda
En `src/controllers/product.controller.ts`, actualizar:
\`\`\`typescript
filters.$or = [
  { name: { $regex: search, $options: "i" } },
  { description: { $regex: search, $options: "i" } },
  // Agregar más campos aquí
]
\`\`\`

## 🐛 Solución de Problemas

### Error de Conexión a MongoDB
\`\`\`bash
# Verificar que MongoDB esté ejecutándose
mongod --version

# Para MongoDB local
mongod

# Verificar la cadena de conexión en .env
\`\`\`

### Frontend no Carga
\`\`\`bash
# Verificar que los archivos estén en public/
ls -la public/

# Recompilar el proyecto
npm run build
npm run dev
\`\`\`

### Error de CORS
Verificar que `FRONTEND_URL` en `.env` coincida con la URL del frontend.

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@chiodelli-bruno](https://github.com/chiodelli-bruno)
- Email: bruno17chioelli@gmail.com

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) - Base de datos
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts](https://fonts.google.com/) - Tipografías

---

⭐ **¡Si este proyecto te fue útil, no olvides darle una estrella!** ⭐

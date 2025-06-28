import { Router } from "express"
import {
  getAllProducts,
  searchProductsByName,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/product.controller"

const router = Router()


router.get("/", getAllProducts) 
router.get("/search", searchProductsByName) 
router.get("/categories", getCategories) 
router.get("/:id", getProductById) 
router.post("/", createProduct) 
router.patch("/:id", updateProduct) 
router.delete("/:id", deleteProduct) 

export default router

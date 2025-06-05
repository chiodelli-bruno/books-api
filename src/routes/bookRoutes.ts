import { Router } from "express"
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../controllers/book.controllers"

const router = Router()


router.get("/", getAllBooks)
router.get("/:id", getBookById)
router.post("/", createBook)
router.patch("/:id", updateBook)
router.delete("/:id", deleteBook)

export default router

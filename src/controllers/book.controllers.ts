import type { Request, Response } from "express"
import Book from "../models/book.model"
import type { IBook } from "../interfaces/book.interface"

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find()
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener los libros",
      details: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

// Obtener un libro por ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      res.status(404).json({
        success: false,
        error: "Libro no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: book,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener el libro",
      details: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

// Crear un nuevo libro
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookData: IBook = req.body

    // Verificar si ya existe un libro con el mismo título
    const existingBook = await Book.findOne({ title: bookData.title })
    if (existingBook) {
      res.status(400).json({
        success: false,
        error: "Ya existe un libro con este título",
      })
      return
    }

    const newBook = await Book.create(bookData)

    res.status(201).json({
      success: true,
      data: newBook,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error al crear el libro",
      details: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

// Actualizar un libro existente
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedBook) {
      res.status(404).json({
        success: false,
        error: "Libro no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: updatedBook,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error al actualizar el libro",
      details: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

// Eliminar un libro
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id)

    if (!deletedBook) {
      res.status(404).json({
        success: false,
        error: "Libro no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Libro eliminado correctamente",
      data: deletedBook,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al eliminar el libro",
      details: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

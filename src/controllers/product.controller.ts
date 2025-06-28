import type { Request, Response } from "express"
import Product from "../models/product.model"
import type { IProduct } from "../interfaces/product.interface"

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, minPrice, maxPrice, available } = req.query


    const filters: any = {}

    if (search && typeof search === "string") {
      filters.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (category && typeof category === "string") {
      filters.category = category
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {}
      if (minPrice !== undefined && typeof minPrice === "string") {
        const min = Number(minPrice)
        if (!isNaN(min)) filters.price.$gte = min
      }
      if (maxPrice !== undefined && typeof maxPrice === "string") {
        const max = Number(maxPrice)
        if (!isNaN(max)) filters.price.$lte = max
      }
    }

    if (available !== undefined) {
      if (typeof available === "string") {
        filters.available = available === "true"
      } else if (typeof available === "boolean") {
        filters.available = available
      }
    }

    const products = await Product.find(filters).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      message:
        search && typeof search === "string"
          ? `Se encontraron ${products.length} productos para "${search}"`
          : "Productos obtenidos exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al obtener los productos",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const searchProductsByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query

    if (!q || typeof q !== "string") {
      res.status(400).json({
        success: false,
        data: null,
        message: "El parámetro de búsqueda 'q' es requerido",
      })
      return
    }

    const searchTerm = q.trim()

    if (searchTerm.length < 2) {
      res.status(400).json({
        success: false,
        data: null,
        message: "El término de búsqueda debe tener al menos 2 caracteres",
      })
      return
    }

    const products = await Product.find({
      $or: [{ name: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }],
      available: true, 
    })
      .sort({ name: 1 })
      .limit(20) 

    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      searchTerm: searchTerm,
      message: `Se encontraron ${products.length} productos para "${searchTerm}"`,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al buscar productos",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}


export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Producto no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: product,
      message: "Producto encontrado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al obtener el producto",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}


export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData: IProduct = req.body

    const existingProduct = await Product.findOne({
      name: { $regex: `^${productData.name}$`, $options: "i" },
    })

    if (existingProduct) {
      res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un producto con este nombre",
      })
      return
    }

    const newProduct = await Product.create(productData)

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Producto creado exitosamente",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Error al crear el producto",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Producto no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Producto actualizado exitosamente",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Error al actualizar el producto",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Producto no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: "Producto eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al eliminar el producto",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct("category")

    res.status(200).json({
      success: true,
      data: categories,
      message: "Categorías obtenidas exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al obtener las categorías",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

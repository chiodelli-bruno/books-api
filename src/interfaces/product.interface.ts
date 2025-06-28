import type { Document } from "mongoose"

export interface IProduct {
  name: string
  description: string
  price: number
  category: string
  stock: number
  available: boolean
  imageUrl?: string
}

export interface IProductDocument extends IProduct, Document {
  createdAt: Date
  updatedAt: Date
}

export interface ISearchQuery {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  available?: boolean
}

import type { Document } from "mongoose"

export interface IBook {
  title: string
  author: string
  publishedYear?: number
  genre?: string
  available: boolean
}

export interface IBookDocument extends IBook, Document {
  createdAt: Date
  updatedAt: Date
}

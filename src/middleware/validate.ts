import type { Request, Response, NextFunction } from "express"
import Joi from "joi"

export const validateBook = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    title: Joi.string().required().trim(),
    author: Joi.string().required().trim(),
    publishedYear: Joi.number().integer().min(1).max(new Date().getFullYear()),
    genre: Joi.string().trim(),
    available: Joi.boolean().default(true),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    res.status(400).json({
      success: false,
      error: "Datos de entrada inválidos",
      details: error.details[0].message,
    })
    return
  }

  next()
}

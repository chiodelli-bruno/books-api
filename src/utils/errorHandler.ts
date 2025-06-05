import type { Response } from "express"

export const handleError = (res: Response, error: unknown, message = "Error en el servidor"): void => {
  console.error(error)

  const statusCode = 500
  const errorMessage = error instanceof Error ? error.message : "Error desconocido"

  res.status(statusCode).json({
    success: false,
    error: message,
    details: errorMessage,
  })
}

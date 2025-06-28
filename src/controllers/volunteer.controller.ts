import type { Request, Response } from "express"
import Volunteer from "../models/volunteer.model"
import type { IVolunteer } from "../interfaces/volunteer.interface"

export const getAllVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: volunteers,
      message: "Voluntarios obtenidos exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al obtener los voluntarios",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const getVolunteerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)

    if (!volunteer) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Voluntario no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: volunteer,
      message: "Voluntario encontrado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al obtener el voluntario",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const createVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteerData: IVolunteer = req.body
    const existingVolunteer = await Volunteer.findOne({ email: volunteerData.email })
    if (existingVolunteer) {
      res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un voluntario registrado con este email",
      })
      return
    }

    const newVolunteer = await Volunteer.create(volunteerData)

    res.status(201).json({
      success: true,
      data: newVolunteer,
      message: "Voluntario registrado exitosamente",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Error al registrar el voluntario",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const updateVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedVolunteer) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Voluntario no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: updatedVolunteer,
      message: "Voluntario actualizado exitosamente",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Error al actualizar el voluntario",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

export const deleteVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id)

    if (!deletedVolunteer) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Voluntario no encontrado",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: deletedVolunteer,
      message: "Voluntario eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error al eliminar el voluntario",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

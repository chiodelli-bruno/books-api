import { Router } from "express"
import {
  getAllVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} from "../controllers/volunteer.controller"

const router = Router()


router.get("/", getAllVolunteers)
router.get("/:id", getVolunteerById)
router.post("/", createVolunteer)
router.patch("/:id", updateVolunteer)
router.delete("/:id", deleteVolunteer)

export default router

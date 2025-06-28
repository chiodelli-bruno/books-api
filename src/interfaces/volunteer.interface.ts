import type { Document } from "mongoose"

export interface IVolunteer {
  name: string
  email: string
  activity: string
}

export interface IVolunteerDocument extends IVolunteer, Document {
  createdAt: Date
  updatedAt: Date
}

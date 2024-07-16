import { Position } from "./Position"

export interface Payment {
  date: Date
  location: string
  positions: Position[]
  eventId: string
}
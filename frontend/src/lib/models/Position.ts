import { User } from "next-auth";

export interface Position {
  id: string;
  name: string;
  paid: boolean;
  user: User;
}

export interface PositionPayment {
  date: string;
  paid: boolean;
  eventId: string;
  position: string;
}
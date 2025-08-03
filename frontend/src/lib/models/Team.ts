import { User } from "next-auth";
import { Position } from "./Position";
import { Event } from "@/lib/models/Event";

export interface Team {
  id?: string;
  name: string;
  event: Event;
  positions?: Position[];
  captain?: User;
}
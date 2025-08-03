import { User } from "next-auth";

export interface Event {
  id?: string | undefined;
  name: string;
  startTime: string;
  endTime: string;
  date: Date;
  location?: Location;
  approveGuests: boolean
  admins: User[]
  cost: number
}

export interface CreateEvent {
  id?: string | undefined;
  name: string;
  startTime: string;
  endTime: string;
  date: Date;
  location?: Location;
  approveGuests: boolean
  admins: User[]
  teamsNumber: number
  cost: number
}

export interface Location {
  id?: string | undefined;
  name: string;
  latLng?: string;
  address: string;
}
import { User } from "next-auth";

export interface Event {
  id?: string | undefined;
  name: string;
  startTime: string;
  endTime: string;
  date: Date;
  location: Location;
  approveGuests: boolean
  admins: User[]
}

export interface Location {
  id?: string | undefined;
  name: string;
  latLng?: string;
  address: string;
}
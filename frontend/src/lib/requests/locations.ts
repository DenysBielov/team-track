import { UUID } from "crypto";
import client from "../client"
import { Location } from "../models/Event";

export async function loadLocations() {
  const endpoint = "/locations/"

  return (await client.get<Location[]>(endpoint)).data;
}

export async function createLocation(location: Location) {
  const endpoint = "/locations/"

  return (await client.post<Location>(endpoint, location)).status;
}

export async function deleteLocation(locationId: string) {
  const endpoint = "/locations/" + locationId;

  return (await client.delete<Location>(endpoint)).status;
}
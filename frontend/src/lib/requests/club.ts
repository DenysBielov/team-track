import client from "../client";
import { Club, ClubCreate } from "../models/Club";


export async function loadClubsByAdmin(adminId: string): Promise<Club[]> {
  const endpoint = `/clubs/${adminId}`

  return (await client.get<Club[]>(endpoint)).data
}

export async function loadClub(clubId: string): Promise<Club> {
  const endpoint = "/clubs/" + clubId;

  return (await client.get<Club>(endpoint)).data
}

export async function createClub(club: ClubCreate) {
  const endpoint = "/clubs/";

  await client.put(endpoint, club)
}

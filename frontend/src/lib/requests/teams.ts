import client from "../client"
import { Position } from "../models/Position"
import { Team } from "../models/Team"

export async function loadTeams(eventId: string): Promise<Team[]> {
  const endpoint = `/events/${eventId}/teams`

  return (await client.get<Team[]>(endpoint)).data
}

export async function createTeam(team: { eventId: string }) {
  const endpoint = `/teams`

  return await client.post(endpoint, team)
}

export async function deleteTeam(teamId: string) {
  const endpoint = `/teams/${teamId}`

  return await client.delete(endpoint)
}

export async function loadTeamPositions(teamId: string) {
  const endpoint = `/teams/${teamId}/positions`

  return (await client.get<Position[]>(endpoint)).data
}

export async function deleteTeamPosition(teamId: string, positionId: string) {
  const endpoint = `/teams/${teamId}/positions/${positionId}`

  await client.delete(endpoint)
}

export async function assignCaptain(teamId: string, userId: string) {
  const endpoint = `/teams/${teamId}/captain/`

  return await client.put(endpoint, { userId })
}
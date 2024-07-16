import { User } from "next-auth";
import client from "../client";
import { GoogleUserCreate, Suspension, UserCreate } from "../models/User";
import { Position, PositionPayment } from "../models/Position";

export async function getUser(userId: string) {
  const endpoint = `/users/${userId}`

  try {
    return (await client.get<User>(endpoint)).data
  } catch (error: any) {
    if (error.response.status == 404) {
      return undefined;
    }

    throw error;
  }
}
export async function getUserPositionPayments(userId: string) {
  const endpoint = `/users/${userId}/positionPayments`

  return (await client.get<PositionPayment[]>(endpoint)).data
}

export async function getSuspension(eventId: string, userId: string): Promise<Suspension> {
  const endpoint = `/users/${userId}/${eventId}/suspension`

  return (await client.get<Suspension>(endpoint)).data
}

export async function updateUser(user: User) {
  const endpoint = `/users/`

  return (await client.put<User>(endpoint, user)).data
}

export async function createUser(user: FormData) {
  const endpoint = "/users"

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  return (await client.post<User>(endpoint, user, config)).data
}

export async function createGoogleUser(user: GoogleUserCreate) {
  const endpoint = "/users/google"

  return (await client.post<User>(endpoint, user)).data
}

export async function saveGoogleUser(user: GoogleUserCreate) {
  const endpoint = "/users/google"

  return (await client.put<User>(endpoint, user)).data
}

export async function login(email: string, password: string): Promise<User> {
  const endpoint = "/users/login"

  return (await client.get<User>(endpoint, { params: { email, password } })).data
}
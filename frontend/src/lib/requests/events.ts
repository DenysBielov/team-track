import client from "../client";
import { CreateEvent, Event } from "../models/Event";


export async function loadEvents(): Promise<Event[]> {
  const endpoint = "/events"

  return (await client.get<Event[]>(endpoint)).data
}

export async function loadEventsByUser(userId: string): Promise<Event[]> {
  const endpoint = "/users/" + userId + "/events"

  return (await client.get<Event[]>(endpoint)).data
}

export async function loadEvent(eventId: string): Promise<Event> {
  const endpoint = "/events/" + eventId;

  return (await client.get<Event>(endpoint)).data
}

export async function createEvent(event: CreateEvent) {
  const endpoint = "/events/";

  await client.post(endpoint, event)
}

export async function saveEvent(event: Event) {
  const endpoint = "/events/";

  await client.put(endpoint, event)
}

export async function deleteEvent(eventId: string) {
  const endpoint = "/events/" + eventId;

  await client.delete(endpoint)
}
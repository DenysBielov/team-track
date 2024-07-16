import client from "../client"
import { Payment } from "../models/Payment"


export async function getEventPayments(userId: string): Promise<Payment[]> {
  const endpoint = `/payments/${userId}`

  return (await client.get<Payment[]>(endpoint)).data
}

export async function updatePayment(positionId: string, paid: boolean) {
  const endpoint = `/payments/${positionId}`

  await client.post(endpoint, { paid: paid })
}
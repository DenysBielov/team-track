import client from "../client";
import { User } from "next-auth";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  user: {
    id: number;
    email: string;
    emailConfirmed: boolean;
    userName: string;
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const endpoint = "/auth/login"

  return (await client.post<AuthResponse>(endpoint, { email, password })).data
}

export async function refreshToken(refreshTokenValue: string): Promise<AuthResponse> {
  const endpoint = "/auth/refresh-token"

  return (await client.post<AuthResponse>(endpoint, { refreshToken: refreshTokenValue })).data
}

export async function logout(refreshTokenValue: string): Promise<void> {
  const endpoint = "/auth/logout"

  await client.post(endpoint, { refreshToken: refreshTokenValue })
}

export async function verifyToken(): Promise<{ valid: boolean; userId: number; email: string; message: string }> {
  const endpoint = "/auth/verify-token"

  return (await client.post(endpoint)).data
}

export async function sendVerification(email: string) {
  const endpoint = `/auth/send-verification-email`

  return await client.post(endpoint, { email })
}

export async function confirmEmail(email: string, token: string) {
  const endpoint = `/auth/verify-email`

  return await client.post<boolean>(endpoint, { email, token })
}

export async function isEmailVerified(email: string) {
  const endpoint = `/auth/is-email-verified?email=${email}`

  return await client.get<boolean>(endpoint)
}

export async function forgotPassword(email: string) {
  const endpoint = `/auth/forgot-password`

  return await client.post(endpoint, { email })
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  const endpoint = `/auth/reset-password`

  return await client.post(endpoint, { email, token, newPassword })
}

export async function getCurrentUser(): Promise<User> {
  const endpoint = `/auth/me`

  return (await client.get<User>(endpoint)).data
}

export interface RegisterResponse {
  message: string;
  requiresEmailConfirmation: boolean;
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  const endpoint = "/auth/register"

  return (await client.post<RegisterResponse>(endpoint, { email, password })).data
}
import { apiClient } from "@/libs/api/api-client";
import type { AuthResponse, AuthUser, LoginRequest, SignupRequest } from "@/types/auth.types";

export async function signup(request: SignupRequest) {
  return apiClient.post("api/auth/signup", { json: request }).json<AuthResponse>();
}

export async function signupAdmin(request: SignupRequest) {
  return apiClient.post("api/admin/auth/signup", { json: request }).json<AuthResponse>();
}

export async function login(request: LoginRequest) {
  return apiClient.post("api/auth/login", { json: request }).json<AuthResponse>();
}

export async function getMe(accessToken: string) {
  return apiClient
    .get("api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<AuthUser>();
}

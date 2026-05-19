import api from "../../services/axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "./authTypes";

export const loginRequest = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  return data;
};

export const registerRequest = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", credentials);
  return data;
};

export const getCurrentUserRequest = async (): Promise<AuthResponse> => {
  const { data } = await api.get<AuthResponse>("/auth/me");
  return data;
};

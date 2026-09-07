import apiClient from "./client";
import type { User } from "../types/api";

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export const registerUser = async (
  userData: RegisterData,
): Promise<User> => {
  const response = await apiClient.post<{
    message: string;
    user: User;
  }>("/users", userData);

  return response.data.user;
};

export const loginUser = async (
  credentials: LoginData,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/users/login",
    credentials,
  );

  return response.data;
};
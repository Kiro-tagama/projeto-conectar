import { api } from "./api";
import type { User } from "./userService";

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data || error.message);
      throw error;
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
    } catch (error: any) {
      console.error("Erro no registro:", error.response?.data || error.message);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>("/auth/profile");
      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao buscar perfil:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export const authService = new AuthService();

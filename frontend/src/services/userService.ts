import { api } from "./api";

const API_URL = "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export interface GetUsersParams {
  role?: "admin" | "user";
  sortBy?: "name" | "email" | "createdAt";
  order?: "ASC" | "DESC";
}

class UserService {
  async getUsers(params?: GetUsersParams): Promise<User[]> {
    const response = await api.get("/users", { params });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export const userService = new UserService();

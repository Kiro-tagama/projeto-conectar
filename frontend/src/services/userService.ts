import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
}

export interface GetUsersParams {
  role?: "user" | "admin" | "";
  sortBy?: "name" | "email" | "createdAt";
  order?: "ASC" | "DESC";
}

export interface GetUsersResponse {
  data: User[];
  total: number;
}

class UserService {
  async getUsers(params: GetUsersParams): Promise<GetUsersResponse> {
    const response = await api.get("/users", { params });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post("/users", data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async getInactiveUsers(): Promise<GetUsersResponse> {
    const response = await api.get("/users/inactive");
    return response.data;
  }
}

export const userService = new UserService();

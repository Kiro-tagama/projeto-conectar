import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User } from "../services/userService";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@Conecta:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    localStorage.setItem("@Conecta:user", JSON.stringify(response.user));
    localStorage.setItem("@Conecta:token", response.access_token);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("@Conecta:user");
    localStorage.removeItem("@Conecta:token");
  };

  const updateUser = (userData: User) => {
    // Garante que todos os campos necessários estejam presentes
    const updatedUser: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || user?.role || "user",
      lastLoginAt: userData.lastLoginAt,
      createdAt: userData.createdAt,
    };
    setUser(updatedUser);
    localStorage.setItem("@Conecta:user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import { SignOutIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";

export function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log(user);
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          setError("As senhas não coincidem");
          return;
        }
      }

      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await userService.updateUser(user!.id, updateData);
      updateUser(updatedUser);
      setSuccess("Perfil atualizado com sucesso!");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error: any) {
      if (error.response?.status === 401) {
        signOut();
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Erro ao atualizar perfil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center gap-4">
        <div className=" text-start">
          <h3>Perfil do Usuário</h3>
          <p className="text-sm text-gray-500">
            Atualize suas informações pessoais.
          </p>
        </div>
        <button className="!w-min !text-rose-400" onClick={handleSignOut}>
          <SignOutIcon size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-6 w-full">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="alt"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="alt"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Nova Senha (opcional)
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="alt"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="alt"
          />
        </div>

        <div>
          <p>Role: {user?.role}</p>
        </div>

        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
      <br />
      <Link to="/" className="w-full">
        <button className="outline">Voltar</button>
      </Link>
    </div>
  );
}

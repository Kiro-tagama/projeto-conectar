import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Bem-vindo ao Conecta
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Sistema de gerenciamento de usuários desenvolvido com NestJS e React
      </p>
      <div className="mt-10 flex flex-row gap-4 justify-center">
        <Link to="/profile" className="w-full">
          <button>Meu Perfil</button>
        </Link>

        {user?.role === "admin" && (
          <Link to="/users" className="w-full">
            <button>Gerenciar Usuários</button>
          </Link>
        )}
      </div>
    </div>
  );
}

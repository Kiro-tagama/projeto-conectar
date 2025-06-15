import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className=" rounded-lg  bg-gray-50 flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Página não encontrada
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <div className="mt-6">
          <Link to="/" className="w-full">
            <button>Voltar para a página inicial</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

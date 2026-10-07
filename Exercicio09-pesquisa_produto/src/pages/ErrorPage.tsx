import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <NavBar />
      <div className="mx-3 md:mx-10 lg:mx-20">
        <h1 className="mb-1 text-xl font-semibold">Página de Erro</h1>
        <hr className="mb-4" />
        {isRouteErrorResponse(error)
          ? "Página requisitada inválida"
          : error instanceof Error
            ? error.message
            : "Erro desconhecido: " + error}
      </div>
    </>
  );
};

export default ErrorPage;

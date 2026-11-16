import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import isErrorResponse from "../util/isErrorResponse";
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
            : isErrorResponse(error)
            ? (
              <div>
                <h6>Mensagem do servidor:</h6>
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify(error, null, 2)}</pre>
              </div>
            )
            : "Erro desconhecido: " + error}
      </div>
    </>
  );
};
export default ErrorPage;
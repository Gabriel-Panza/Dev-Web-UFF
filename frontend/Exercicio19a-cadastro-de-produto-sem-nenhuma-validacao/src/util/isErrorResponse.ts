import type { ErrorResponse } from "../interfaces/ErrorResponse";

// Esta guarda permite ao TypeScript tratar o JSON da API como ErrorResponse
// no bloco em que a função retorna true.
function isErrorResponse(error: unknown): error is ErrorResponse {
  return typeof error === "object" && error !== null
    && "requestUri" in error && typeof error.requestUri === "string";
}
export default isErrorResponse;

import type { TokenResponse } from "../interfaces/TokenResponse";
import estaAutenticado from "./estaAutenticado";

const ehAdministrador = (tokenResponse: TokenResponse) => {
  return estaAutenticado(tokenResponse) && tokenResponse.role === "ADMIN";
};

export default ehAdministrador;

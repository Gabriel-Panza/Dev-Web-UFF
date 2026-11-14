import type { TokenResponse } from "../interfaces/TokenResponse";

const estaAutenticado = (tokenResponse: TokenResponse) => {
  return !!tokenResponse.token && tokenResponse.idUsuario > 0;
};

export default estaAutenticado;

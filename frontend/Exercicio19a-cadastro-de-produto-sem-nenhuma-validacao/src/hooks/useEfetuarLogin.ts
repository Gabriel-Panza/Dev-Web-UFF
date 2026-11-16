import { useMutation } from "@tanstack/react-query";
import type { Usuario } from "../interfaces/Usuario";
import type { TokenResponse } from "../interfaces/TokenResponse";

const efetuarLogin = async (usuario: Usuario): Promise<TokenResponse> => {
  const response = await fetch("http://localhost:8080/autenticacao/login", {
    method: "POST",
    headers: {
        "Content-type": "Application/json"
    },
    body: JSON.stringify(usuario)
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao efetuar login. Status code: " +
        response.status
    );
  }
  return await response.json();
};

const useEfetuarLogin = () => {
  return useMutation({
    mutationFn: (usuario: Usuario) => efetuarLogin(usuario),
  });
};
export default useEfetuarLogin;

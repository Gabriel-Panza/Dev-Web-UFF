import { useMutation } from "@tanstack/react-query";
import type { Usuario } from "../interfaces/Usuario";
import type { TokenResponse } from "../interfaces/TokenResponse";

const efetuarLogin = async (usuario: Usuario): Promise<TokenResponse> => {
  let response: Response;
  try {
    // O proxy do Vite encaminha /api para http://localhost:8080.
    response = await fetch("/api/autenticacao/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(usuario),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se o backend está rodando.",
    );
  }
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao efetuar login. Status code: " + response.status,
    );
  }
  const resultado: TokenResponse = await response.json();
  if (
    !resultado ||
    typeof resultado.token !== "string" ||
    !Number.isSafeInteger(resultado.idUsuario) ||
    resultado.idUsuario < 0 ||
    typeof resultado.nome !== "string" ||
    typeof resultado.role !== "string"
  ) {
    throw new Error(
      "A resposta de login é incompatível. Reinicie o backend do exercício 14 atualizado.",
    );
  }
  return resultado;
};

const useEfetuarLogin = () => {
  return useMutation({
    mutationFn: (usuario: Usuario) => efetuarLogin(usuario),
    retry: false,
  });
};
export default useEfetuarLogin;

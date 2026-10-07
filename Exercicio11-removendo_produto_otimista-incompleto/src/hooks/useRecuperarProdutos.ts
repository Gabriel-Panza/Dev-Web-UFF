import { useQuery } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";
import { URL_PRODUTOS } from "../util/constantes";

const recuperarProdutos = async (): Promise<Produto[]> => {
  const response = await fetch(URL_PRODUTOS);
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos. Status code = " + response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: () => recuperarProdutos(),
    staleTime: 15000,
  });
};
export default useRecuperarProdutos;

import { useQuery } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";

const recuperarProdutos = async (): Promise<Produto[]> => {
  const response = await fetch("/api/produtos");
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar os produtos. Status Code = " +
        response.status,
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

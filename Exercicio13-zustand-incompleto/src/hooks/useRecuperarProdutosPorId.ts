import { useQuery } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";

const recuperarProdutoPorId = async (id: number): Promise<Produto> => {
  const response = await fetch("/api/produtos/" + id);
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar o produto com id = " +
        id +
        ". Status code = " +
        response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutoPorId = (id: number, removido: boolean) => {
  return useQuery({
    queryKey: ["produtos", id],
    queryFn: () => recuperarProdutoPorId(id),
    staleTime: 15000,
    enabled: !removido,
  });
};
export default useRecuperarProdutoPorId;

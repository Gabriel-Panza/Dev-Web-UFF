import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import isErrorResponse from "../util/isErrorResponse";
import type { ProdutoDto } from "../interfaces/ProdutoDto";
import type { Produto } from "../interfaces/Produto";
import useFetchWithAuth, { type FetchWithAuth } from "./useFetchWithAuth";

const alterarProduto = async (
  produto: ProdutoDto, fetchWithAuth: FetchWithAuth): Promise<Produto> => {
    
  const response = await fetchWithAuth("http://localhost:8080/produtos", {
    method: "PUT",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    const error: unknown = await response.json();
    if (isErrorResponse(error)) {
      throw error;
    } else {
      throw new Error(
        "Ocorreu um erro ao alterar um produto. Status code: " +
          response.status,
      );
    }
  }
  return await response.json();
};

const useAlterarProduto = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useMutation({
    mutationFn: (produto: ProdutoDto) => alterarProduto(produto, fetchWithAuth),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["produtos"],
        exact: false,
      });
    },
  });
};
export default useAlterarProduto;

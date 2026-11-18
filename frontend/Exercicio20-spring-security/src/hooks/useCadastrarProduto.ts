import { useMutation } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";
import { queryClient } from "../main";
import isErrorResponse from "../util/isErrorResponse";
import type { ProdutoDto } from "../interfaces/ProdutoDto";
import useFetchWithAuth, { type FetchWithAuth } from "./useFetchWithAuth";

const cadastrarProduto = async (
  produto: ProdutoDto, fetchWithAuth: FetchWithAuth): Promise<Produto> => {
    
  const response = await fetchWithAuth("http://localhost:8080/produtos", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    const error: unknown = await response.json();
    if (isErrorResponse(error)) {
      // Quando ocorre um BAD_REQUEST (algum campo de produto não informado
      // ou no caso de violação de constraint de foreign key).
      throw error;
    } else {
      throw new Error(
        "Ocorreu um erro ao cadastrar um produto. Status code: " +
          response.status,
      );
    }
  }
  return await response.json();
};

const useCadastrarProduto = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useMutation({
    mutationFn: (produto: ProdutoDto) => cadastrarProduto(produto, fetchWithAuth),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["produtos"],
        exact: false,
      });
    },
  });
};
export default useCadastrarProduto;

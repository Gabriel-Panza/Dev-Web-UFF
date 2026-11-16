import { useMutation } from "@tanstack/react-query";
import type { Produto, ProdutoParaSalvar } from "../interfaces/Produto";
import isErrorResponse from "../util/isErrorResponse";
import { queryClient } from "../main";

const cadastrarProduto = async (produto: ProdutoParaSalvar): Promise<Produto> => {
  const response = await fetch("http://localhost:8080/produtos", {
    method: "POST",
    headers: {
        "Content-type": "Application/json"
    },
    body: JSON.stringify(produto)
  });
  if (!response.ok) {
    const error: unknown = await response.json().catch(() => null);
    if (isErrorResponse(error)) throw error;
    throw new Error(
      "Ocorreu um erro ao cadastrar um produto. Status code: " + response.status
    );
  }
  return await response.json();
};

const useCadastrarProduto = () => {
  return useMutation({
    mutationFn: (produto: ProdutoParaSalvar) => cadastrarProduto(produto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["produtos"],
        exact: false
      })      
    }
  });
};
export default useCadastrarProduto;
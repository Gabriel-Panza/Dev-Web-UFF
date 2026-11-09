import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Produto, ProdutoAtualizacao } from "../interfaces/Produto";
import useTokenStore from "../store/TokenStore";
import ehAdministrador from "../util/ehAdministrador";

const alterarProduto = async (
  produto: ProdutoAtualizacao,
): Promise<Produto> => {
  if (!ehAdministrador(useTokenStore.getState().tokenResponse)) {
    throw new Error("Somente administradores podem alterar produtos.");
  }
  const response = await fetch("/api/produtos", {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao alterar um produto. Status code: " + response.status,
    );
  }
  return response.json();
};

const useAlterarProduto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (produto: ProdutoAtualizacao) => alterarProduto(produto),
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["produtos"],
        exact: false,
      });
    },
  });
};
export default useAlterarProduto;

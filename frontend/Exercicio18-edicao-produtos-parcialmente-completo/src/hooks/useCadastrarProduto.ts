import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NovoProduto, Produto } from "../interfaces/Produto";
import useTokenStore from "../store/TokenStore";
import ehAdministrador from "../util/ehAdministrador";

const cadastrarProduto = async (produto: NovoProduto): Promise<Produto> => {
  if (!ehAdministrador(useTokenStore.getState().tokenResponse)) {
    throw new Error("Somente administradores podem cadastrar produtos.");
  }
  const response = await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao cadastrar um produto. Status code: " +
        response.status,
    );
  }
  return response.json();
};

const useCadastrarProduto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (produto: NovoProduto) => cadastrarProduto(produto),
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["produtos"],
        exact: false,
      });
    },
  });
};
export default useCadastrarProduto;

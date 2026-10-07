import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import type { Produto } from "../interfaces/Produto";
import { URL_PRODUTOS } from "../util/constantes";

const removerProdutoPorId = async (id: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000)
  });
  const response = await fetch(URL_PRODUTOS + "/" + id, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao remover o produto com id = " + id + ". Status code = " + response.status,
    );
  }
  // return response.json();
};

const useRemoverProdutoPorId = () => {
  return useMutation({
    mutationFn: (id: number) => removerProdutoPorId(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["produtos"] });

      const produtosAntesDaRemocao = queryClient.getQueryData<Produto[]>([
        "produtos",
      ]);

      queryClient.setQueryData<Produto[]>(["produtos"], (produtos) => {
        return produtos?.filter((produto) => produto.id != id);
      });

      return { produtosAntesDaRemocao };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(
        ["produtos"],
        context?.produtosAntesDaRemocao,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["produtos"],
      });
    },
  });
};
export default useRemoverProdutoPorId;

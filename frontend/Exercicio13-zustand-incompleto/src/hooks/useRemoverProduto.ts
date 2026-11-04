import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProdutoStore from "../store/ProdutoStore";

const removerProdutoPorId = async (id: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  const response = await fetch("/api/produtos/" + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao remover o produto com id = " +
        id +
        ". status code: " +
        response.status,
    );
  }
  // return response.json();  O backend retorna void
};

const useRemoverProduto = () => {
  const queryClient = useQueryClient();
  const setIdRemovendo = useProdutoStore((state) => state.setIdRemovendo);
  return useMutation({
    mutationFn: (id: number) => removerProdutoPorId(id),
    onMutate: (id: number) => setIdRemovendo(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({
        queryKey: ["produtos", id],
        exact: true,
        refetchType: "none",
      });

      queryClient.removeQueries({
        queryKey: ["produtos", id],
        exact: true,
        type: "inactive",
      });
    },
    onSettled: async () => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["produtos"], exact: true }),
          queryClient.invalidateQueries({ queryKey: ["produtos", "paginacao"] }),
        ]);
      } finally {
        setIdRemovendo(null);
      }
    },
  });
};
export default useRemoverProduto;

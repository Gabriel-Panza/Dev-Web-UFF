import { useMutation, useQueryClient } from "@tanstack/react-query";

const removerProdutoPorId = async (id: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000);
  });

  const response = await fetch(`/api/produtos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao remover o produto com id = " +
        id +
        ". Status Code = " +
        response.status,
    );
  }
};

const useRemoverProdutoPorId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removerProdutoPorId(id),
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

      await queryClient.invalidateQueries({
        queryKey: ["produtos"],
        predicate: (query) => typeof query.queryKey[1] !== "number",
      });
    },
  });
};

export default useRemoverProdutoPorId;

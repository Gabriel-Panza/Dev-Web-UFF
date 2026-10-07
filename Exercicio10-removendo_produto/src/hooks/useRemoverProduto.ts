import { useMutation } from "@tanstack/react-query";

const removerProduto = async (id: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000);
  });

  const response = await fetch(`/api/produtos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao remover o produto. Status Code = " +
        response.status,
    );
  }
};

const useRemoverProduto = () => {
  return useMutation({
    mutationFn: (id: number) => removerProduto(id),
  });
};

export default useRemoverProduto;

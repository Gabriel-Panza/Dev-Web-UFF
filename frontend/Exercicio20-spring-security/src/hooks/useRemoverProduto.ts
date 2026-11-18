import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import useProdutoStore from "../store/useProdutoStore";
import useFetchWithAuth, { type FetchWithAuth } from "./useFetchWithAuth";
import isErrorResponse from "../util/isErrorResponse";

const removerProdutoPorId = async (id: number, fetchWithAuth: FetchWithAuth) => {

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000)
  });
  
  const response = await fetchWithAuth("http://localhost:8080/produtos/" + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error: unknown = await response.json();
    if (isErrorResponse(error)) {
      // Esse erro não irá ocorrer pois o service não gera uma exceção
      // quando não encontra o produto que está tentando remover.
      throw error;
    }
    throw new Error(
      "Ocorreu um erro ao recuperar o produto com id = " +
        id +
        ". status code: " +
        response.status,
    );
  }
  // return response.json();  O backend retorna void
};

const useRemoverProduto = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useMutation({
    mutationFn: (id: number) => removerProdutoPorId(id, fetchWithAuth),
    onSettled: () => {
      // Para que o label do botão Remover saia de Removendo... e volte
      // para Remover, independentemente da remoção ocorrer ou não. Se a
      // remoção ocorrer, como a linha desaparece, o botão com o label 
      // Removendo... some junto. Mas se o produto não for removido por
      // falta de permissão é preciso mudar o idRemovendo para null para
      // que o label volte de Removendo... para Remover.
      useProdutoStore.getState().setIdRemovendo(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["produtos"],
      });
    },
  });
};
export default useRemoverProduto;

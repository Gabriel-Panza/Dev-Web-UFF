import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";

  const removerProdutoPorId = async (id: number) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000)
    });
    const response = await fetch(
      "http://localhost:8080/produtos/" + id, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(
        "Ocorreu um erro ao recuperar o produto com id = " + id + ". status code: " + 
        response.status)
    }
    // return response.json();  O backend retorna void
  }
  
  const useRemoverProduto = () => {
      return useMutation({
        mutationFn: (id: number) => removerProdutoPorId(id),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["produtos"]
          })
        }
      });
  }
  export default useRemoverProduto;

import { useQuery } from "@tanstack/react-query";
import useFetchWithAuth, { type FetchWithAuth } from "./useFetchWithAuth";
import isErrorResponse from "../util/isErrorResponse";

const recuperarProdutoPorId = async (id: number,fetchWithAuth: FetchWithAuth) => {

  const response = await fetchWithAuth("http://localhost:8080/produtos/" + id);
  if (!response.ok) {
    const error: unknown = await response.json();
    if (isErrorResponse(error)) {
      // Esse erro irá ocorrer sempre que tentarmos recuperar um produto
      // que tenha sido removido. O service propaga a exceção 
      // EntidadeNaoEncontradaException e o GlobalExceptionHandler retorna
      // um ErrorResponse.
      throw error;
    }
    throw new Error(
      "Ocorreu um erro ao recuperar o produto com id = " +
        id +
        ". Status code = " +
        response.status,
    );
  }
  return await response.json();
};

const useRecuperarProdutoPorId = (id: number, removido: boolean) => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useQuery({
    queryKey: ["produtos", id],
    queryFn: () => recuperarProdutoPorId(id, fetchWithAuth),
    staleTime: 15000,
    enabled: !removido,
  });
};
export default useRecuperarProdutoPorId;

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";
import type { Produto } from "../interfaces/Produto";
import useFetchWithAuth, { type FetchWithAuth } from "./useFetchWithAuth";

const recuperarProdutosComPaginacao = async (
  queryString: Record<string, string>,
  fetchWithAuth: FetchWithAuth): Promise<ResultadoPaginado<Produto>> => {

  const response = await fetchWithAuth(
    "http://localhost:8080/produtos/paginacao?" +
      new URLSearchParams(queryString),
  );
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos. Status code = " + response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutosComPaginacao = (
  queryString: Record<string, string>,
) => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useQuery({
    queryKey: ["produtos", "paginacao", queryString],
    queryFn: () => recuperarProdutosComPaginacao(queryString, fetchWithAuth),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
export default useRecuperarProdutosComPaginacao;

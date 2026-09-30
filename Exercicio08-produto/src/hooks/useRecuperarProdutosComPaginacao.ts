import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";
import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";

const recuperarProdutosComPaginacao = async (
  queryString: Record<string, string>,
): Promise<ResultadoPaginado<Produto>> => {
  const num = await new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 0);
  });
  console.log(num);
  const response = await fetch(
    "/api/produtos/paginacao?" + new URLSearchParams(queryString),
  );
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar os produtos. Status Code = " +
        response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutosComPaginacao = (
  queryString: Record<string, string>,
) => {
  return useQuery({
    queryKey: ["produtos", "paginacao", queryString],
    queryFn: () => recuperarProdutosComPaginacao(queryString),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};

export default useRecuperarProdutosComPaginacao;

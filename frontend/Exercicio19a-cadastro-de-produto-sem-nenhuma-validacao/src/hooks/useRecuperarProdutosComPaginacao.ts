import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";
import type { Produto } from "../interfaces/Produto";

const recuperarProdutosComPaginacao = 
  async (queryString: Record<string, string>): Promise<ResultadoPaginado<Produto>> => {
  
  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 2000)
  // });
  
  const response = await fetch(
    "http://localhost:8080/produtos/paginacao?" + new URLSearchParams(queryString));
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos. Status code = " + response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutosComPaginacao = (queryString: Record<string, string>) => {
  return useQuery({
    queryKey: ["produtos", "paginacao", queryString],
    queryFn: () => recuperarProdutosComPaginacao(queryString),
    staleTime: 0,
    placeholderData: keepPreviousData
  });
};
export default useRecuperarProdutosComPaginacao;

import { useQuery } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";
import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";

const recuperarProdutosComPaginacao = async (
  pagina: number,
  tamanho: number,
): Promise<ResultadoPaginado<Produto>> => {
  const response = await fetch(
    "/api/produtos/paginacao?pagina=" + pagina + "&tamanho=" + tamanho,
  );
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar os produtos. Status Code = " +
        response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutosComPaginacao = (pagina: number, tamanho: number) => {
  return useQuery({
    queryKey: ["produtos", "paginacao", pagina, tamanho],
    queryFn: () => recuperarProdutosComPaginacao(pagina, tamanho),
    staleTime: 0,
  });
};

export default useRecuperarProdutosComPaginacao;

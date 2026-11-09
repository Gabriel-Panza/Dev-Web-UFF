import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";
import type { Produto } from "../interfaces/Produto";
import useProdutoStore from "../store/ProdutoStore";

const recuperarProdutosComPaginacao = async (
  queryString: Record<string, string>,
): Promise<ResultadoPaginado<Produto>> => {
  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 2000)
  // });

  const response = await fetch(
    "/api/produtos/paginacao?" + new URLSearchParams(queryString),
  );
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos. Status code = " + response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutosComPaginacao = () => {
  const pagina = useProdutoStore((state) => state.pagina);
  const nome = useProdutoStore((state) => state.nome);
  const tamanho = useProdutoStore((state) => state.tamanho);
  const queryString = {
    pagina: pagina.toString(),
    tamanho: tamanho.toString(),
    nome,
  };
  return useQuery({
    queryKey: ["produtos", "paginacao", queryString],
    queryFn: () => recuperarProdutosComPaginacao(queryString),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
export default useRecuperarProdutosComPaginacao;

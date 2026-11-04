import { useCallback, useState } from "react";
import Pesquisa from "../components/Pesquisa";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";

const ProdutosComPaginacaoPage = () => {
  const [pagina, setPagina] = useState(0);
  const [nome, setNome] = useState("");
  const tamanho: number = 5;
  const pesquisarProduto = useCallback((nomePesquisado: string) => {
    setPagina(0);
    setNome(nomePesquisado);
  }, []);

  const queryString = {
    pagina: pagina.toString(),
    tamanho: tamanho.toString(),
    nome,
  };

  const {
    data: resultadoPaginado,
    isPending: recuperandoProdutosComPaginacao,
    error: errorRecuperarProdutosComPaginacao,
  } = useRecuperarProdutosComPaginacao(queryString);

  if (recuperandoProdutosComPaginacao)
    return <h5 className="text-xl"> Recuperando produtos...</h5>;
  if (errorRecuperarProdutosComPaginacao)
    throw errorRecuperarProdutosComPaginacao;

  const produtos = resultadoPaginado.itens;
  const totalDePaginas = resultadoPaginado.totalDePaginas;
  const pages = Array.from({ length: totalDePaginas }, (_, index) => index);

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <Pesquisa onPesquisar={pesquisarProduto} />
      <TabelaDeProdutos produtos={produtos} />

      {totalDePaginas > 1 && (
        <nav className="my-4" aria-label="Paginação">
          <ul className="flex">
          <li>
            <button
              type="button"
              className={
                "rounded-l-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-200 " +
                (pagina === 0
                  ? "cursor-not-allowed bg-gray-300 opacity-50"
                  : "cursor-pointer bg-white text-green-700")
              }
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 0}
            >
              Anterior
            </button>
          </li>

          {pages.map((page) => (
            <li key={page}>
              <button
                type="button"
                className={
                  "cursor-pointer border px-4 py-2 font-semibold " +
                  (pagina === page
                    ? "border-green-800 bg-green-700 text-white"
                    : "border-gray-300 bg-white text-green-600 hover:bg-gray-100")
                }
                onClick={() => setPagina(page)}
                aria-current={pagina === page ? "page" : undefined}
              >
                {page + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              type="button"
              className={
                "rounded-r-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-200 " +
                (pagina === totalDePaginas - 1
                  ? "cursor-not-allowed bg-gray-300 opacity-50"
                  : "cursor-pointer bg-white text-green-700")
              }
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalDePaginas - 1}
            >
              Próxima
            </button>
          </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default ProdutosComPaginacaoPage;

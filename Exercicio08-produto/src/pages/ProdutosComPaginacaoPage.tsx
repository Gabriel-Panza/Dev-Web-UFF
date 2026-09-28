import { useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";

const ProdutosComPaginacaoPage = () => {
  const [pagina, setPagina] = useState(0);
  const tamanho: number = 5;

  const {
    data: resultadoPaginado,
    isPending: recuperandoProdutosComPaginacao,
    error: errorRecuperarProdutosComPaginacao,
  } = useRecuperarProdutosComPaginacao(pagina, tamanho);

  if (recuperandoProdutosComPaginacao)
    return <h5 className="text-xl"> Recuperando produtos...</h5>;
  if (errorRecuperarProdutosComPaginacao)
    throw errorRecuperarProdutosComPaginacao;

  const produtos = resultadoPaginado.itens;
  const totalDePaginas = resultadoPaginado.totalDePaginas;
  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
      <button
        className="btn-success px-4 py-1"
        onClick={() => setPagina(pagina - 1)}
        disabled={pagina == 0}
      >
        Anterior
      </button>
      <button
        className="btn-success mb-3 px-4 py-1"
        onClick={() => setPagina(pagina + 1)}
        disabled={pagina == totalDePaginas - 1}
      >
        Proxima
      </button>
    </>
  );
};

export default ProdutosComPaginacaoPage;

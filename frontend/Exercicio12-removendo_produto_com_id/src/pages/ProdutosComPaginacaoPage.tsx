import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Pesquisa from "../components/Pesquisa";
import Paginacao from "../components/Paginacao";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";
import useRemoverProdutoPorId from "../hooks/useRemoverProdutoPorId";

const ProdutosComPaginacaoPage = () => {
  const location = useLocation();
  const [produtoRemovido, setProdutoRemovido] = useState<string>(() =>
    typeof location.state?.produtoRemovido === "string"
      ? location.state.produtoRemovido
      : "",
  );
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    if (!produtoRemovido) return;

    const timer = setTimeout(() => setProdutoRemovido(""), 4000);
    return () => clearTimeout(timer);
  }, [produtoRemovido]);

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
  const {
    mutate: removerProduto,
    isPending: removendoProduto,
    variables: idRemovendo,
    error: errorRemoverProduto,
  } = useRemoverProdutoPorId();

  if (recuperandoProdutosComPaginacao)
    return <h5 className="text-xl"> Recuperando produtos...</h5>;
  if (errorRecuperarProdutosComPaginacao)
    throw errorRecuperarProdutosComPaginacao;
  if (errorRemoverProduto) throw errorRemoverProduto;

  const produtos = resultadoPaginado.itens;
  const totalDePaginas = resultadoPaginado.totalDePaginas;
  const tratarPaginacao = (pagina: number) => {
    setPagina(pagina);
  };

  const tratarRemocao = (id: number) => {
    const nomeProduto =
      produtos.find((produto) => produto.id === id)?.nome ?? "";
    const deveVoltarUmaPagina = produtos.length === 1 && pagina > 0;

    setProdutoRemovido("");

    removerProduto(id, {
      onSuccess: () => {
        setProdutoRemovido(nomeProduto);
        if (deveVoltarUmaPagina) {
          setPagina((paginaAtual) =>
            paginaAtual === pagina ? Math.max(0, paginaAtual - 1) : paginaAtual,
          );
        }
      },
    });
  };

  return (
    <>
      {produtoRemovido && (
        <div
          className="mb-3 rounded-lg border-2 border-yellow-400 bg-yellow-200 px-4 py-3 font-semibold text-yellow-950"
          role="status"
        >
          Produto {produtoRemovido} foi removido com sucesso
        </div>
      )}
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <Pesquisa onPesquisar={pesquisarProduto} />
      <TabelaDeProdutos
        produtos={produtos}
        onRemover={tratarRemocao}
        idRemovendo={removendoProduto ? idRemovendo : undefined}
      />

      <Paginacao
        pagina={pagina}
        totalDePaginas={totalDePaginas}
        tratarPaginacao={tratarPaginacao}
      />
    </>
  );
};

export default ProdutosComPaginacaoPage;

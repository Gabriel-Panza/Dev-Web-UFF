import { useCallback, useState } from "react";
import Pesquisa from "../components/Pesquisa";
import Paginacao from "../components/Paginacao";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";
import useRemoverProduto from "../hooks/useRemoverProduto";

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
  const {
    mutate: removerProduto,
    isPending: removendoProduto,
    variables: idRemovendo,
    error: errorRemoverProduto,
  } = useRemoverProduto();

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
    const deveVoltarUmaPagina = produtos.length === 1 && pagina > 0;

    removerProduto(id, {
      onSuccess: () => {
        if (deveVoltarUmaPagina) {
          setPagina((paginaAtual) => paginaAtual - 1);
        }
      },
    });
  };

  return (
    <>
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

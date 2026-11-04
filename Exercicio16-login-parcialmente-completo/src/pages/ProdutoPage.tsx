import { useParams } from "react-router-dom";
import useRecuperarProdutoPorId from "../hooks/useRecuperarProdutosPorId";
import dayjs from "dayjs";
import useRemoverProduto from "../hooks/useRemoverProduto";
import { useState } from "react";

const ProdutoPage = () => {
  const [removido, setRemovido] = useState(false);

  const { id } = useParams();

  const {
    mutate: removerProduto,
    isPending: removendoProduto,
    error: errorRemocaoProduto,
  } = useRemoverProduto();

  const tratarRemocao = (id: number) => {
    removerProduto(id, { onSuccess: () => setRemovido(true) });
  };
  const {
    data: produto,
    isPending: recuperandoProduto,
    error: errorRecuperarProduto,
  } = useRecuperarProdutoPorId(+id!, removido || removendoProduto);

  if (recuperandoProduto)
    return <h5 className="text-xl font-semibold">Recuperando produto...</h5>;
  if (errorRecuperarProduto) throw errorRecuperarProduto;
  if (errorRemocaoProduto) throw errorRemocaoProduto;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Página de Produto</h1>
      <hr className="mb-4" />

      {removido && (
        <div className="mb-3 border-2 border-green-600 bg-green-100 px-4 py-3 font-semibold text-green-900">
          Produto removido com sucesso
        </div>
      )}
      <div className="mb-3 grid grid-cols-12">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          {/* Para chegar nessa página o url foi /produtos/:id */}
          {/* Sem a / abaixo seria enviada uma requisição para /produtos/abacate.png*/}
          <div className="ms-5">
            <img
              className="hidden sm:block"
              src={"/" + produto.imagem}
              width="210px"
            />
            <img
              className="block sm:hidden"
              src={"/" + produto.imagem}
              width="170px"
            />
          </div>
        </div>
        <div className="col-span-12 mb-4 lg:col-span-8 xl:col-span-9">
          <div className="grid grid-cols-12">
            <div className="col-span-4 mb-1 font-semibold lg:col-span-3 xl:col-span-2">
              Categoria
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.categoria.nome}
            </div>

            <div className="col-span-4 mb-1 font-semibold lg:col-span-3 xl:col-span-2">
              Nome
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.nome} ({produto.descricao})
            </div>

            <div className="col-span-4 mb-1 font-semibold lg:col-span-3 xl:col-span-2">
              Preço
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })}
            </div>

            <div className="col-span-4 mb-1 font-semibold lg:col-span-3 xl:col-span-2">
              Estoque
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.qtdEstoque}
            </div>

            <div className="col-span-4 mb-1 font-semibold lg:col-span-3 xl:col-span-2">
              Data Cadastro
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {dayjs(produto.dataCadastro).format("DD/MM/YYYY")}
            </div>

            <div className="col-span-4 mb-1 font-semibold lg:col-span-3 xl:col-span-2">
              Disponível
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.disponivel ? "Sim" : "Não"}
            </div>
          </div>
        </div>
        <div className="col-span-4 me-4 xl:col-span-3">
          <button
            disabled={removido || removendoProduto}
            className="btn-success w-full py-1"
            type="button"
          >
            Editar
          </button>
        </div>
        <div className="col-span-4 me-4 xl:col-span-3">
          <button
            disabled={removido || removendoProduto}
            onClick={() => tratarRemocao(produto.id)}
            className="btn-danger w-full py-1"
            type="button"
          >
            {removendoProduto ? "Removendo..." : "Remover"}
          </button>
        </div>
      </div>
    </>
  );
};
export default ProdutoPage;

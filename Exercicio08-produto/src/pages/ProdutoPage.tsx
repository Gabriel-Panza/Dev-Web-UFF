import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import useRecuperarProdutoPorId from "../hooks/useRecuperarProdutoPorId";

const ProdutoPage = () => {
  const { id } = useParams();

  const {
    data: produto,
    isPending: recuperandoProduto,
    error: errorRecuperarProduto,
  } = useRecuperarProdutoPorId(+id!);

  if (recuperandoProduto) {
    return <h5 className="text-xl">Recuperando produto...</h5>;
  }

  if (errorRecuperarProduto) {
    throw errorRecuperarProduto;
  }

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Página de Produto</h1>
      <hr className="mb-4" />

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
        <div className="md:col-span-4 lg:col-span-3">
          {/* Para chegar nessa página o URL foi /produtos/:id */}
          {/* Sem a / abaixo seria enviada uma requisição para /produtos/abacate.png */}
          <div className="flex justify-center">
            <img src={"/" + produto.imagem} alt={produto.nome} width="210" />
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-5">
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
            <div className="font-semibold">Categoria</div>
            <div>{produto.categoria.nome}</div>

            <div className="font-semibold">Nome</div>
            <div>
              {produto.nome} ({produto.descricao})
            </div>

            <div className="font-semibold">Preço</div>
            <div>
              {produto.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })}
            </div>

            <div className="font-semibold">Estoque</div>
            <div>{produto.qtdEstoque}</div>

            <div className="font-semibold">Data Cadastro</div>
            <div>{dayjs(produto.dataCadastro).format("DD/MM/YYYY")}</div>

            <div className="font-semibold">Disponível</div>
            <div>{produto.disponivel ? "Sim" : "Não"}</div>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-2">
          <button className="btn-success w-full py-1" type="button">
            Editar
          </button>
        </div>

        <div className="md:col-span-6 lg:col-span-2">
          <button className="btn-danger w-full py-1" type="button">
            Remover
          </button>
        </div>
      </div>
    </>
  );
};

export default ProdutoPage;

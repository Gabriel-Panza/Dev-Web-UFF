import { useParams } from "react-router-dom"
import useRecuperarProdutoPorId from "../hooks/useRecuperarProdutosPorId";
import dayjs from "dayjs";

const ProdutoPage = () => {
  const {id} = useParams();  

  const {data: produto,
        isPending: recuperandoProduto,
        error: errorRecuperarProduto} = useRecuperarProdutoPorId(+id!);

  if (recuperandoProduto) return <h5 className="text-xl font-semibold">Recuperando produto...</h5>;
  if (errorRecuperarProduto) throw errorRecuperarProduto;      
        
  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Página de Produto</h1>
      <hr className="mb-4" />

      <div className="mb-3 grid grid-cols-12">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          {/* Para chegar nessa página o url foi /produtos/:id */}
          {/* Sem a / abaixo seria enviada uma requisição para /produtos/abacate.png*/}
          <div className="ms-5">
            <img className="hidden sm:block " src={"/" + produto.imagem} width="210px" />
            <img className="block sm:hidden" src={"/" + produto.imagem} width="170px" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 mb-4">
          <div className="grid grid-cols-12">
            <div className="font-semibold col-span-4 lg:col-span-3 xl:col-span-2 mb-1">Categoria</div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">{produto.categoria.nome}</div>

            <div className="font-semibold col-span-4 lg:col-span-3 xl:col-span-2 mb-1">Nome</div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">{produto.nome} ({produto.descricao})</div>

            <div className="font-semibold col-span-4 lg:col-span-3 xl:col-span-2 mb-1">Preço</div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
                {produto.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })}
            </div>

            <div className="font-semibold col-span-4 lg:col-span-3 xl:col-span-2 mb-1">Estoque</div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">{produto.qtdEstoque}</div>

            <div className="font-semibold col-span-4 lg:col-span-3 xl:col-span-2 mb-1">Data Cadastro</div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">{dayjs(produto.dataCadastro).format("DD/MM/YYYY")}</div>
            
            <div className="font-semibold col-span-4 lg:col-span-3 xl:col-span-2 mb-1">Disponível</div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">{produto.disponivel ? "Sim" : "Não"}</div>

          </div>
        </div>
        <div className="col-span-4 xl:col-span-3 me-4">
          <button className="btn-success w-full py-1" type="button">Editar</button>
        </div>
        <div className="col-span-4 xl:col-span-3 me-4">
          <button className="btn-danger w-full py-1" type="button">Remover</button>
        </div>
      </div>
    </>
  )
}
export default ProdutoPage


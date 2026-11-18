import Paginacao from "../components/Paginacao";
import Pesquisa from "../components/Pesquisa";
import TabelaDeProdutos from "../components/TabelaDeProdutos";


const ProdutosComPaginacaoPage = () => {
  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Lista de Produtos</h1>
      <hr className="mb-4" />

      <Pesquisa />
      <TabelaDeProdutos />
      <Paginacao />
    </>
  )
}
export default ProdutosComPaginacaoPage
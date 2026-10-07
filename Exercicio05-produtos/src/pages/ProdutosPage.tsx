import TabelaDeProdutos from "../components/TabelaDeProdutos";
import recuperarProdutos from "../util/recuperarProdutos";

const ProdutosPage = () => {
  const produtos = recuperarProdutos();
  return (
    <>
      <div className="mb-1 text-xl font-semibold">Lista de Produtos</div>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
    </>
  );
};

export default ProdutosPage;

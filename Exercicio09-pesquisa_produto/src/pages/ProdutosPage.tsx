import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";

const ProdutosPage = () => {
  const {
    data: produtos,
    isPending: recuperandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutos();

  if (recuperandoProdutos)
    return <h5 className="text-xl"> Recuperando produtos...</h5>;
  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
    </>
  );
};

export default ProdutosPage;

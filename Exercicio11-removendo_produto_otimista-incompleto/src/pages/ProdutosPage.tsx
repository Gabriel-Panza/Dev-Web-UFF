import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";
import useRemoverProdutoPorId from "../hooks/useRemoverProdutoPorId";

const ProdutosPage = () => {
  const {
    data: produtos,
    isPending: recuperandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutos();

  const tratarRemocao = (id: number) => {
    removerProduto(id);
  };

  const { mutate: removerProduto } = useRemoverProdutoPorId();

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;

  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} tratarRemocao={tratarRemocao} />
    </>
  );
};
export default ProdutosPage;

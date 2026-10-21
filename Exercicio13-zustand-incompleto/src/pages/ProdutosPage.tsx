import { TabelaDeProdutosConteudo } from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";
import useRemoverProduto from "../hooks/useRemoverProduto";

const ProdutosPage = () => {
  const { mutate: removerProduto, error: erroRemocao } = useRemoverProduto();

  const {
    data: produtos,
    isPending: recuperandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutos();

  if (recuperandoProdutos)
    return <h5 className="text-xl">Recuperando produtos...</h5>;
  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (erroRemocao) throw erroRemocao;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutosConteudo
        produtos={produtos}
        tratarRemocao={(id) => removerProduto(id)}
      />
    </>
  );
};
export default ProdutosPage;

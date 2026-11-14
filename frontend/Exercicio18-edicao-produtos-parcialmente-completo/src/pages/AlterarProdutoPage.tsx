import { useParams } from "react-router-dom";
import ProdutoForm from "../components/ProdutoForm";
import useRecuperarProdutoPorId from "../hooks/useRecuperarProdutosPorId";

const AlterarProdutoPage = () => {
  const { id } = useParams();
  const {
    data: produto,
    isPending,
    error,
  } = useRecuperarProdutoPorId(+id!, false);

  if (isPending) return <h5 className="text-xl">Recuperando produto...</h5>;
  if (error) throw error;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Alteração de Produto</h1>
      <hr className="mb-4" />
      <ProdutoForm key={produto.id} produto={produto} />
    </>
  );
};
export default AlterarProdutoPage;

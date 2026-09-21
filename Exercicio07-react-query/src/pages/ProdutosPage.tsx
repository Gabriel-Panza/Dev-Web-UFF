import { useQuery } from "@tanstack/react-query";
import TabelaDeProdutos from "../components/TabelaDeProdutos";

const recuperarProdutos = async () => {
  const response = await fetch("/api/produtos");
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar os produtos. Status Code = " +
        response.status,
    );
  }
  return response.json();
};

const ProdutosPage = () => {
  const {
    data: produtos,
    isPending: recuperandoProdutos,
    error: errorRecuperarProdutos,
  } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => recuperarProdutos(),
    staleTime: 15000,
  });

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

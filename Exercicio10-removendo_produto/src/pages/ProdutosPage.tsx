import { useQueryClient } from "@tanstack/react-query";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";
import useRemoverProduto from "../hooks/useRemoverProduto";

const ProdutosPage = () => {
  const queryClient = useQueryClient();
  const {
    data: produtos,
    isPending: recuperandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutos();
  const {
    mutate: removerProduto,
    isPending: removendoProduto,
    variables: idRemovendo,
    error: errorRemoverProduto,
  } = useRemoverProduto();

  const remover = (id: number) => {
    removerProduto(id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["produtos"] });
      },
    });
  };

  if (recuperandoProdutos)
    return <h5 className="text-xl"> Recuperando produtos...</h5>;
  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (errorRemoverProduto) throw errorRemoverProduto;
  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos
        produtos={produtos}
        onRemover={remover}
        idRemovendo={removendoProduto ? idRemovendo : undefined}
      />
    </>
  );
};

export default ProdutosPage;

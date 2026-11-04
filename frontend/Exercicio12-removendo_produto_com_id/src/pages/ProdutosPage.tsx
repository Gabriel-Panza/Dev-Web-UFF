import { useEffect, useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";
import useRemoverProdutoPorId from "../hooks/useRemoverProdutoPorId";

const ProdutosPage = () => {
  const [produtoRemovido, setProdutoRemovido] = useState("");

  useEffect(() => {
    if (!produtoRemovido) return;

    const timer = setTimeout(() => setProdutoRemovido(""), 4000);
    return () => clearTimeout(timer);
  }, [produtoRemovido]);

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
  } = useRemoverProdutoPorId();

  const tratarRemocao = (id: number) => {
    const nomeProduto =
      produtos?.find((produto) => produto.id === id)?.nome ?? "";
    setProdutoRemovido("");
    removerProduto(id, {
      onSuccess: () => {
        setProdutoRemovido(nomeProduto);
      },
    });
  };

  if (recuperandoProdutos)
    return <h5 className="text-xl"> Recuperando produtos...</h5>;
  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (errorRemoverProduto) throw errorRemoverProduto;
  return (
    <>
      {produtoRemovido && (
        <div
          className="mb-3 rounded-lg border-2 border-yellow-400 bg-yellow-200 px-4 py-3 font-semibold text-yellow-950"
          role="status"
        >
          Produto {produtoRemovido} foi removido com sucesso
        </div>
      )}
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos
        produtos={produtos}
        onRemover={tratarRemocao}
        idRemovendo={removendoProduto ? idRemovendo : undefined}
      />
    </>
  );
};

export default ProdutosPage;

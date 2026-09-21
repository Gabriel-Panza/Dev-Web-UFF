import { useEffect, useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import type { Produto } from "../interfaces/Produto";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/produtos", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Ocorreu um erro ao recuperar produtos. Status code: " +
              response.status,
          );
        }
        return response.json() as Promise<Produto[]>;
      })
      .then((produtos) => {
        setProdutos(produtos);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setErro(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro desconhecido: " + String(error),
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    return () => controller.abort();
  }, []);

  if (erro) return <p className="text-xl">{erro}</p>;
  if (carregando) return <h5 className="text-xl">Recuperando produtos...</h5>;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      {produtos.length === 0 ? (
        <p className="text-xl">Nenhum produto encontrado.</p>
      ) : (
        <TabelaDeProdutos produtos={produtos} />
      )}
    </>
  );
};

export default ProdutosPage;

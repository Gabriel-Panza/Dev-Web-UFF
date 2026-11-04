import { useEffect, useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import type { Produto } from "../interfaces/Produto";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  console.log("1, 9");

  useEffect(() => {
    console.log("4");
    const controller = new AbortController();

    fetch("/api/produtos", { signal: controller.signal })
      .then((response) => {
        console.log("6");
        if (!response.ok) {
          throw new Error(
            "Ocorreu um erro ao recuperar produtos. Status code: " +
              response.status,
          );
        }
        return response.json() as Promise<Produto[]>;
      })
      .then((produtos) => {
        console.log("7");
        console.log("produtos = ", produtos);
        setProdutos(produtos);
        console.log("8");
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

    console.log("5");
    return () => controller.abort();
  }, []);

  console.log("2, 10");

  if (erro) return <p className="text-xl">{erro}</p>;
  if (carregando) {
    console.log("3");
    return <h5 className="text-xl">Recuperando produtos...</h5>;
  }

  console.log("11");

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

import { useQuery } from "@tanstack/react-query";

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

const useRecuperarProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: () => recuperarProdutos(),
    staleTime: 15000,
  });
};

export default useRecuperarProdutos;

import { useQuery } from "@tanstack/react-query";
import useFetchWithAuth, { type FetchWithAuth } from "./useFetchWithAuth";

const recuperarProdutos = async (fetchWithAuth: FetchWithAuth) => {

  const response = await fetchWithAuth("http://localhost:8080/produtos");
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos. Status code = " + response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutos = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useQuery({
    queryKey: ["produtos"],
    queryFn: () => recuperarProdutos(fetchWithAuth),
    staleTime: 15000,
  });
};
export default useRecuperarProdutos;

import { useQuery } from "@tanstack/react-query";
import { URL_PRODUTOS } from "../util/constantes";

const recuperarProdutoPorId = async (id: number) => {
  const response = await fetch(URL_PRODUTOS + "/" + id);
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar o produto com id = " + id + ". Status code = " + response.status,
    );
  }
  return response.json();
};

const useRecuperarProdutoPorId = (id: number) => {
  return useQuery({
    queryKey: ["produtos", id],
    queryFn: () => recuperarProdutoPorId(id),
    staleTime: 15000,
  });
};
export default useRecuperarProdutoPorId;

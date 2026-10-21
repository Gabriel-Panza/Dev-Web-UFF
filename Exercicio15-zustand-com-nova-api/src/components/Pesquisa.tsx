import _ from "lodash";
import { useEffect, useMemo } from "react";
import useProdutoStore from "../store/ProdutoStore";

const Pesquisa = () => {
  const nomeInicial = useProdutoStore((state) => state.nome);
  const setPagina = useProdutoStore((state) => state.setPagina);
  const setNome = useProdutoStore((state) => state.setNome);
  const debouncedFunction = useMemo(
    () =>
      _.debounce((nome: string) => {
        setPagina(0);
        setNome(nome);
      }, 1000),
    [setPagina, setNome],
  );

  useEffect(() => () => debouncedFunction.cancel(), [debouncedFunction]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFunction(event.target.value);
  };

  return (
    <input
      onChange={handleChange}
      defaultValue={nomeInicial}
      className={
        "mb-3 w-full rounded border-2 py-1 ps-2 " +
        " me-3 border-gray-400 hover:border-gray-600"
      }
      type="text"
      placeholder="Informe o nome do produto..."
    />
  );
};
export default Pesquisa;

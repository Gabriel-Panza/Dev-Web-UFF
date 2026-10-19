import debounce from "lodash/debounce";
import {
  useEffect,
  useMemo,
  type ChangeEvent,
} from "react";

interface Props {
  onPesquisar: (nome: string) => void;
}

const Pesquisa = ({ onPesquisar }: Props) => {
  const pesquisarComAtraso = useMemo(
    () => debounce((nome: string) => onPesquisar(nome.trim()), 1100),
    [onPesquisar],
  );

  useEffect(() => {
    return () => pesquisarComAtraso.cancel();
  }, [pesquisarComAtraso]);

  const alterarNome = (event: ChangeEvent<HTMLInputElement>) => {
    pesquisarComAtraso(event.target.value);
  };

  return (
      <input
        className="mb-4 block w-full rounded-lg border border-gray-500 px-3 py-2"
        type="search"
        placeholder="Informe o nome do produto..."
        aria-label="Nome do produto"
        onChange={alterarNome}
      />
  );
};

export default Pesquisa;

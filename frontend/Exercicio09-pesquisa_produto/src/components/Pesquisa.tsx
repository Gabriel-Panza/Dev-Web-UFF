import debounce from "lodash/debounce";
import {
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";

interface Props {
  onPesquisar: (nome: string) => void;
}

const Pesquisa = ({ onPesquisar }: Props) => {
  const nomeRef = useRef<HTMLInputElement>(null);
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

  const pesquisar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pesquisarComAtraso.cancel();
    onPesquisar(nomeRef.current?.value.trim() ?? "");
  };

  return (
    <form className="mb-4 flex gap-2" onSubmit={pesquisar}>
      <input
        ref={nomeRef}
        className="w-full rounded-lg border border-gray-500 px-3 py-2"
        type="search"
        placeholder="Informe o nome do produto..."
        aria-label="Nome do produto"
        onChange={alterarNome}
      />
      <button className="btn-success px-4 py-2" type="submit">
        Pesquisar
      </button>
    </form>
  );
};

export default Pesquisa;

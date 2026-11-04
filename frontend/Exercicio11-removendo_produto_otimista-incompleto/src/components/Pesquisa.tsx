import _ from "lodash";

interface Props {
  tratarPesquisa: (nome: string) => void;
}

const Pesquisa = ({ tratarPesquisa }: Props) => {
  const debouncedFunction = _.debounce((nome: string) => {
    console.log("Chamou tratarPesquisa");
    tratarPesquisa(nome);
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Entrou em handle change");
    debouncedFunction(event.target.value);
  };

  return (
    <input
      onChange={handleChange}
      placeholder="Informe o nome do produto..."
      className="me-2 mb-2 w-full rounded border-2 border-gray-400 px-2 py-1 hover:border-gray-700"
      type="text"
    />
  );
};
export default Pesquisa;

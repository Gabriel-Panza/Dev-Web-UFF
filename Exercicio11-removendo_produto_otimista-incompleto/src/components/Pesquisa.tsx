import _ from "lodash";

interface Props {
    tratarPesquisa: (nome: string) => void;
}

const Pesquisa = ({tratarPesquisa}: Props) => {

  const debouncedFunction = _.debounce((nome: string) => {
    console.log("Chamou tratarPesquisa");
    tratarPesquisa(nome);
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Entrou em handle change");
    debouncedFunction(event.target.value);
  }

  return (
    <input onChange={handleChange} placeholder="Informe o nome do produto..." className="w-full rounded border-2 border-gray-400 hover:border-gray-700 px-2 py-1 me-2 mb-2" type="text" />
  )
}
export default Pesquisa
import _ from "lodash";
import useProdutoStore from "../store/useProdutoStore";

const Pesquisa = () => {
  const setNome = useProdutoStore(s => s.setNome);

  const debouncedFunction = _.debounce((nome: string) => {
    setNome(nome);
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFunction(event.target.value);
  }

  return (
      <input onChange={handleChange}
             className={"mb-3 py-1 w-full rounded ps-2 border-2 " +
                        " border-gray-400 hover:border-gray-600 me-3"} 
             type="text"
             placeholder="Informe o nome do produto..." />
  );
};
export default Pesquisa;

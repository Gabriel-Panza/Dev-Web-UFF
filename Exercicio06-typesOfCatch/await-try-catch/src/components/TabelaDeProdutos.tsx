import type { Produto } from "../interfaces/Produto";
import iconDelete from "../assets/skin/database_delete.png";
import formatarData from "../util/formatarData";

interface Props {
  produtos: Produto[];
}

const TabelaDeProdutos = ({ produtos }: Props) => {
  return (
    <div className="">
      <table className="w-full border-2 border-gray-400">
        <thead>
          <tr className="border-2 border-gray-400 bg-gray-300">
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Id
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Imagem
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Categoria
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Nome
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Disponível
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Data de Cadastro
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Preço
            </th>
            <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr
              key={produto.id}
              className={
                "border-b border-b-gray-200 " +
                (index % 2 === 0 ? "bg-white" : "bg-gray-100")
              }
            >
              <td className="w-[8%] border-r border-r-gray-200 py-1 text-center">
                {produto.id}
              </td>
              <td className="w-[10%] border-r border-r-gray-200 py-1 text-center">
                <div className="flex justify-center">
                  <img src={`/${produto.imagem}`} alt={produto.nome} width="40" />
                </div>
              </td>
              <td className="w-[13%] border-r border-r-gray-200 py-1 text-center">
                {produto.categoria.nome}
              </td>
              <td className="w-[20%] border-r border-r-gray-200 py-1 ps-2">
                {produto.nome}
              </td>
              <td className="w-[13%] border-r border-r-gray-200 py-1 text-center">
                {produto.disponivel ? "Sim" : "Não"}
              </td>
              <td className="w-[13%] border-r border-r-gray-200 py-1 text-center">
                {formatarData(produto.dataCadastro)}
              </td>
              <td className="w-[10%] border-r border-r-gray-200 py-1 pe-2 text-end">
                {produto.preco.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })}
              </td>
              <td className="w-[13%] border-r border-r-gray-200 py-1">
                <div className="flex justify-center">
                  <button
                    className="btn-danger flex items-center px-4 py-1"
                    type="button"
                  >
                    <img className="me-1" src={iconDelete} />
                    Remover
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelaDeProdutos;

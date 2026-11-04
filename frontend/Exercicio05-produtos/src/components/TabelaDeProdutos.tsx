import dayjs from "dayjs";
import type { Produto } from "../interfaces/Produto";

const imagens = import.meta.glob<string>("../assets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

interface Props {
  produtos: Produto[];
}

const TabelaDeProdutos = ({ produtos }: Props) => {
  return (
    <table className="w-full border-2 border-gray-400">
      <thead>
        <tr className="border-2 border-gray-400 bg-gray-300">
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Id</th>
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Imagem</th>
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Categoria</th>
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Nome</th>
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Disponível</th>
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Data de Cadastro</th>
          <th className="border-r border-r-gray-200 p-1.5 text-center font-semibold">Preço</th>
          <th className="p-1.5 text-center font-semibold">Ação</th>
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
            <td className="w-[8%] border-r border-r-gray-200 py-1 text-center">{produto.id}</td>
            <td className="w-[10%] border-r border-r-gray-200 py-1 text-center">
              <img
                src={imagens[`../assets/${produto.imagem}`]}
                alt={produto.nome}
                className="mx-auto h-12 w-12 object-contain"
              />
            </td>
            <td className="w-[13%] border-r border-r-gray-200 py-1 text-center">{produto.categoria.nome}</td>
            <td className="w-[20%] border-r border-r-gray-200 py-1 text-center">{produto.nome}</td>
            <td className="w-[13%] border-r border-r-gray-200 py-1 text-center">{produto.disponivel ? "Sim" : "Não"}</td>
            <td className="w-[13%] border-r border-r-gray-200 py-1 text-center">
              {dayjs(produto.dataCadastro).format("DD/MM/YYYY")}
            </td>
            <td className="w-[10%] border-r border-r-gray-200 py-1 text-center">{produto.preco}</td>
            <td className="w-[13%] py-1 text-center">
              <button type="button" className="btn-danger px-3 py-1">
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelaDeProdutos;

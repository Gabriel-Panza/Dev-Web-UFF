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
    <table className="w-full border-2 border-gray-500/40">
      <thead className="bg-gray-500/20">
        <tr>
          <th>Id</th>
          <th>Imagem</th>
          <th>Categoria</th>
          <th>Nome</th>
          <th>Disponível</th>
          <th>Data de Cadastro</th>
          <th>Preço</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.id}>
            <td className="w-[8%]">{produto.id}</td>
            <td className="w-[10%]">
              <img
                src={imagens[`../assets/${produto.imagem}`]}
                alt={produto.nome}
                className="mx-auto h-12 w-12 object-contain"
              />
            </td>
            <td className="w-[13%]">{produto.categoria.nome}</td>
            <td className="w-[20%]">{produto.nome}</td>
            <td className="w-[13%]">{produto.disponivel ? "Sim" : "Não"}</td>
            <td className="w-[13%]">
              {dayjs(produto.dataCadastro).format("DD/MM/YYYY")}
            </td>
            <td className="w-[10%]">{produto.preco}</td>
            <td className="w-[13%]">
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

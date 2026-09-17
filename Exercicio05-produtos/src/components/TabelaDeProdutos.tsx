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
    <table className="w-full">
      <thead>
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
            <td>{produto.id}</td>
            <td>
              <img
                src={imagens[`../assets/${produto.imagem}`]}
                alt={produto.nome}
                className="mx-auto h-12 w-12 object-contain"
              />
            </td>
            <td>{produto.categoria.nome}</td>
            <td>{produto.nome}</td>
            <td>{produto.disponivel ? "Sim" : "Não"}</td>
            <td>{produto.dataCadastro.getFullYear()}</td>
            <td>{produto.preco}</td>
            <td>
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

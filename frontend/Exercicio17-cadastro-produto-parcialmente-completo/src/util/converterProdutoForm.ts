import type { ProdutoForm } from "../interfaces/ProdutoForm";
import type { NovoProduto } from "../interfaces/Produto";

const converterProdutoForm = (dados: ProdutoForm): NovoProduto => {
  return {
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    categoria: { id: dados.categoria },
    qtdEstoque: Number(dados.qtd_estoque),
    dataCadastro: dados.data_cadastro,
    preco: Number(dados.preco),
    imagem: dados.imagem.trim(),
    disponivel: dados.disponivel,
  };
};

export default converterProdutoForm;

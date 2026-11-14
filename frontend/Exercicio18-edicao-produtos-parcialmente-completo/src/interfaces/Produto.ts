import type { Categoria } from "./Categoria";

export interface Produto {
  id: number;
  imagem: string;
  categoria: Categoria;
  nome: string;
  descricao: string;
  disponivel: boolean;
  dataCadastro: Date;
  qtdEstoque: number;
  preco: number;
}

// No POST o banco gera o ID; a API recebe a data ISO e apenas o ID da categoria.
export type NovoProduto = Omit<Produto, "id" | "categoria" | "dataCadastro"> & {
  categoria: Pick<Categoria, "id">;
  dataCadastro: string;
};

export type ProdutoAtualizacao = NovoProduto & { id: number };

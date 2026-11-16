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

export type ProdutoParaSalvar = Omit<Produto, "id" | "categoria" | "dataCadastro" | "qtdEstoque" | "preco"> & {
  id?: number;
  categoria: Pick<Categoria, "id"> | null;
  dataCadastro: string | null;
  qtdEstoque: number | null;
  preco: number | null;
};

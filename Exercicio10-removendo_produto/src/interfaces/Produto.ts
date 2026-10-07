import type { Categoria } from "./Categoria";

export interface Produto {
  id: number;
  imagem: string;
  categoria: Categoria;
  nome: string;
  descricao: string;
  disponivel: boolean;
  dataCadastro: string | Date;
  qtdEstoque: number;
  preco: number;
}

import type { Categoria } from "./Categoria";

export interface ProdutoDto {
  id?: number;
  imagem: string;
  categoria: Categoria;
  nome: string;
  descricao: string;
  disponivel: boolean;   
  dataCadastro: Date | null;
  qtdEstoque: number | null;
  preco: number | null;
}

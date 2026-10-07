export interface ResultadoPaginado<T> {
  totalDeItens: number;
  totalDePaginas: number;
  PaginaCorrente: number;
  itens: T[];
}

import { create } from "zustand";

interface ProdutoStore {
  pagina: number;
  nome: string;
  tamanho: number;
  idRemovendo: number | null;

  setPagina: (pagina: number) => void;
  setNome: (nome: string) => void;
  setIdRemovendo: (id: number | null) => void;
}

const useProdutoStore = create<ProdutoStore>((set) => ({
  pagina: 0,
  nome: "",
  tamanho: 5,
  idRemovendo: null,

  setPagina: (novaPagina: number) => set(() => ({ pagina: novaPagina })),
  setNome: (novoNome: string) => set(() => ({ nome: novoNome })),
  setIdRemovendo: (novoIdRemovendo: number | null) =>
    set(() => ({ idRemovendo: novoIdRemovendo })),
}));

export default useProdutoStore;

import { create } from "zustand";
import type { Produto } from "../interfaces/Produto";

interface ProdutoStore {
    pagina: number;
    nome: string;
    tamanho: number;
    idRemovendo: number | null;
    mensagem: string;
    produtoSelecionado: Produto;

    setPagina: (pagina: number) => void;
    setNome: (nome: string) => void;
    setIdRemovendo: (id: number | null) => void;
    setMensagem: (mensagem: string) => void;
    setProdutoSelecionado: (produtoSelecionado: Produto) => void;
}

const useProdutoStore = create<ProdutoStore>((set) => ({
    pagina: 0,
    nome: "",
    tamanho: 5,
    idRemovendo: null,
    mensagem: "",
    produtoSelecionado: {} as Produto,

    setPagina: (novaPagina: number) => set(() => ({pagina: novaPagina})),
    setNome: (novoNome: string) => set(() => ({nome: novoNome})),
    setIdRemovendo: (novoIdRemovendo: number | null) => set(() => ({idRemovendo: novoIdRemovendo})),
    setMensagem: (novaMensagem: string) => set(() => ({mensagem: novaMensagem})),
    setProdutoSelecionado: (novoProdutoSelecionado: Produto) => set(() => ({produtoSelecionado: novoProdutoSelecionado}))
}))
export default useProdutoStore;
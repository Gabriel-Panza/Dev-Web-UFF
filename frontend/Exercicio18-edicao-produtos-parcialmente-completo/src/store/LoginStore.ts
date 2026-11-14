import { create } from "zustand";

interface LoginStore {
  msg: string;
  setMsg: (novoMsg: string) => void;
}

const useLoginStore = create<LoginStore>((set) => ({
  msg: "",
  setMsg: (novoMsg: string) => set(() => ({ msg: novoMsg })),
}));
export default useLoginStore;

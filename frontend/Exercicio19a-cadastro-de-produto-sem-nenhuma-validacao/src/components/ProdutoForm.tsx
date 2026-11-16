import { useForm } from "react-hook-form";
import databaseAdd from "../assets/skin/database_add.png";
import databaseEdit from "../assets/skin/database_edit.png";
import databaseCancel from "../assets/skin/multiply.png";
import type { Produto, ProdutoParaSalvar } from "../interfaces/Produto";
import useCadastrarProduto from "../hooks/useCadastrarProduto";
import { useNavigate } from "react-router-dom";
import useProdutoStore from "../store/useProdutoStore";
import { useCallback, useEffect } from "react";
import dayjs from "dayjs";
import useAlterarProduto from "../hooks/useAlterarProduto";

interface FormProduto {
  nome: string;
  descricao: string;
  categoria: number;
  qtd_estoque: string;
  data_cadastro: string;
  preco: string;
  imagem: string;
  disponivel: boolean;
}

const produtoInicial: FormProduto = {
    nome: "",
    descricao: "",
    categoria: 0,
    qtd_estoque: "",
    data_cadastro: "",
    preco: "",
    imagem: "",
    disponivel: false,
  };

const ProdutoForm = () => {
  const navigate = useNavigate();
  const setMensagem = useProdutoStore((s) => s.setMensagem);
  const produtoSelecionado = useProdutoStore((s) => s.produtoSelecionado);

  const { register, handleSubmit, reset } = useForm<FormProduto>({
    defaultValues: produtoInicial,
  });

  const inicializarForm = useCallback(() => {
    reset(produtoSelecionado.id ? {
      nome: produtoSelecionado.nome,
      descricao: produtoSelecionado.descricao,
      categoria: produtoSelecionado.categoria?.id ?? 0,
      qtd_estoque: produtoSelecionado.qtdEstoque?.toString() ?? "",
      data_cadastro: produtoSelecionado.dataCadastro
        ? dayjs(produtoSelecionado.dataCadastro).format("YYYY-MM-DD")
        : "",
      preco: produtoSelecionado.preco?.toFixed(2) ?? "",
      imagem: produtoSelecionado.imagem,
      disponivel: produtoSelecionado.disponivel,
    } : produtoInicial);
  }, [produtoSelecionado, reset]);

  useEffect(() => {
    inicializarForm();
  }, [inicializarForm]);

  const {mutate: cadastrarProduto,
         error: errorCadastrarProduto} = useCadastrarProduto();

  const {mutate: alterarProduto,
         error: errorAlterarProduto} = useAlterarProduto();

  const submit = ({nome, descricao, categoria, 
                   qtd_estoque, data_cadastro, preco, 
                   imagem, disponivel}: FormProduto) => {
    const produto: ProdutoParaSalvar = {
        nome: nome,
        descricao: descricao,
        categoria: categoria ? { id: categoria } : null,
        qtdEstoque: qtd_estoque ? +qtd_estoque : null,
        // LocalDate recebe a data do formulário sem conversão de fuso horário.
        dataCadastro: data_cadastro || null,
        preco: preco ? +preco : null,
        imagem: imagem,
        disponivel: disponivel
    };

    if (produtoSelecionado.id) {  
      produto.id = produtoSelecionado.id;
      alterarProduto(produto, {
        onSuccess: (produto: Produto) => {
            setMensagem("Produto alterado com sucesso.");
            navigate("/produtos/" + produto.id);
        }
      })
    } else {
      cadastrarProduto(produto, {
        onSuccess: (produto: Produto) => {
            setMensagem("Produto cadastrado com sucesso.");
            navigate("/produtos/" + produto.id);
        }
      })
    }
  }

  if (errorCadastrarProduto) throw errorCadastrarProduto;
  if (errorAlterarProduto) throw errorAlterarProduto;

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-6" autoComplete="off" noValidate>
      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="nome"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Nome
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("nome")}
                type="text"
                // id="nome"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="descricao"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Descrição
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("descricao")}
                type="text"
                // id="descricao"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="categoria"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Categoria
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <select
                {...register("categoria", { setValueAs: Number })}
                // id="categoria"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              >
                <option value="0">Selecione uma categoria</option>
                <option value="1">Fruta</option>
                <option value="2">Legume</option>
                <option value="3">Verdura</option>
              </select>
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="data_cadastro"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              <span className="hidden md:block">Data Cad.</span>
              <span className="md:hidden">Data de Cadastro</span>
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("data_cadastro")}
                type="date"
                // id="data_cadastro"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="preco"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Preço
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("preco")}
                type="number"
                step="0.01"
                min="0.10"
                // id="preco"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="qtd_estoque"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Estoque
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("qtd_estoque")}
                type="number"
                min="0"
                // id="qtd_estoque"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              // htmlFor="imagem"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Imagem
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("imagem")}
                type="text"
                // id="imagem"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <div className="flex items-center col-span-9 lg:col-start-4 xl:col-start-3">
              <input
                {...register("disponivel")}
                type="checkbox"
                // id="disponivel"
                className="form-checkbox mr-2 h-4 w-4 text-blue-600"
              />
              <label 
                // htmlFor="disponivel" 
                className="col-span-3 xl:col-span-2 mb-1 flex items-center font-bold">
                Disponível?
              </label>
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 mb-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-start-4 xl:col-start-3 flex">
              <button type="submit"
                className="flex justify-center items-center btn-success px-5 py-1.5 me-3">
                  {produtoSelecionado.id ? 
                  <>
                    <img src={databaseEdit} className="me-2" /> Alterar
                  </> 
                  : 
                  <>
                    <img src={databaseAdd} className="me-2" /> Cadastrar
                  </>}
              </button>
              <button type="button"
                onClick={() => navigate(-1)}
                className="flex justify-center items-center btn-secondary px-5 py-1.5 me-3">
                    <img src={databaseCancel} className="me-2" /> Cancelar
              </button>
            </div>
          </div>
        </div>  
      </div>

    </form>

  )
}
export default ProdutoForm

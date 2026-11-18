import { useForm } from "react-hook-form";
import databaseAdd from "../assets/skin/database_add.png";
import databaseEdit from "../assets/skin/database_edit.png";
import databaseCancel from "../assets/skin/multiply.png";
import type { Produto } from "../interfaces/Produto";
import useCadastrarProduto from "../hooks/useCadastrarProduto";
import { useNavigate } from "react-router-dom";
import useProdutoStore from "../store/useProdutoStore";
import { useCallback, useEffect } from "react";
import type { Categoria } from "../interfaces/Categoria";
import dayjs from "dayjs";
import useAlterarProduto from "../hooks/useAlterarProduto";
import type { ProdutoDto } from "../interfaces/ProdutoDto";
import z from "zod";
import isCategoriaValida from "../util/isCategoriaValida";
import isDataValida from "../util/isDataValida";
import { zodResolver } from "@hookform/resolvers/zod";

// interface ProdutoForm {
//   nome: string;
//   descricao: string;
//   categoria: number;
//   qtd_estoque: string;
//   data_cadastro: string;
//   preco: string;
//   imagem: string;
//   disponivel: boolean;
// }

// interface ProdutoForm {
//   nome: string;
//   descricao: string;
//   categoria: number;
//   qtd_estoque: string;
//   data_cadastro: string;
//   preco: string;
//   imagem: string;
//   disponivel: boolean;
// }

const regexImagem = /^[a-z]+\.(gif|jpg|png|bmp)$/;
const schema = z.object({
  nome: z
    .string()
    .nonempty({ message: "O 'nome' deve ser informado." })
    .min(3, { message: "O 'nome' deve ter pelo menos 3 caracteres." }),
  descricao: z
    .string()
    .nonempty("A 'descrição' deve ser informada."),
  categoria: z
    .number()
    .refine(isCategoriaValida, {message: "A 'categoria' deve ser informada."}),
  data_cadastro: z
    .string()
    .nonempty("A 'data de cadastro' deve ser informada.")
    .refine(isDataValida, "Data inválida."),
  preco: z
    .string()
    .nonempty("O preço deve ser informado")
    .refine((val) => +val > 0.10, {message: "O 'preço' deve ser > 0,10"}),
  qtd_estoque: z
    .string()
    .nonempty("A 'quantidade em estoque' deve ser informada"),
  imagem: z
    .string()
    .nonempty("A 'imagem' deve ser informada.")
    // Expressão regular só funciona se o tipo no zod for string
    // e no html o input for type="text".
    .regex(regexImagem, { message: "Nome de imagem inválido." }),
  disponivel: z.boolean(),
});

type ProdutoForm = z.infer<typeof schema>;

const ProdutoForm = () => {
  const navigate = useNavigate();
  const setMensagem = useProdutoStore((s) => s.setMensagem);
  const produtoSelecionado = useProdutoStore((s) => s.produtoSelecionado);

  const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm<ProdutoForm>({resolver: zodResolver(schema)});

  const inicializarForm = useCallback(() => {
    if (produtoSelecionado.id) {
      setValue("nome", produtoSelecionado.nome);
      setValue("descricao", produtoSelecionado.descricao);
      setValue("categoria", produtoSelecionado.categoria.id);
      setValue("qtd_estoque", produtoSelecionado.qtdEstoque.toString());
      setValue("data_cadastro", dayjs(produtoSelecionado.dataCadastro).format("YYYY-MM-DD"));
      setValue("preco", produtoSelecionado.preco.toFixed(2));
      setValue("imagem", produtoSelecionado.imagem);
      setValue("disponivel", produtoSelecionado.disponivel);
    } else {
      reset();
    }
  }, [produtoSelecionado, reset, setValue]);

  useEffect(inicializarForm, [inicializarForm]);

  const {mutate: cadastrarProduto,
         error: errorCadastrarProduto} = useCadastrarProduto();

  const {mutate: alterarProduto,
         error: errorAlterarProduto} = useAlterarProduto();

  const submit = ({nome, descricao, categoria, 
                   qtd_estoque, data_cadastro, preco, 
                   imagem, disponivel}: ProdutoForm) => {
                    
    console.log("data_cadastro = ", data_cadastro);
    console.log("data_cadastro.substring(0,4) = ", data_cadastro.substring(0,4));
    console.log("+data_cadastro.substring(0,4) = ", +data_cadastro.substring(0,4));
    console.log("Data de cadastro = ", new Date(+data_cadastro.substring(0,4),
                               +data_cadastro.substring(5,7) - 1,
                               +data_cadastro.substring(8,10)));

    // O + converte um string vazio em zero.
    // new Date(0/0/1) representa 01/01/1900 
    // new Date(0/0/0) representa 31/12/1899    (um dia antes)
    // new Date(0/-1/0) representa 30/11/1899   (um mês antes)
                           
    console.log("+qtd_Estoque = ", +qtd_estoque);
    console.log("+preco = ", +preco);
                    
    const produtoDto: ProdutoDto = {
        nome: nome,
        descricao: descricao,
        categoria: {id: categoria} as Categoria,
        qtdEstoque: qtd_estoque ? +qtd_estoque : null,
        dataCadastro: data_cadastro ? new Date(+data_cadastro.substring(0,4),
                               +data_cadastro.substring(5,7) - 1,
                               +data_cadastro.substring(8,10)) : null,
        preco: preco ? +preco : null,
        imagem: imagem,
        disponivel: disponivel
    };

    if (produtoSelecionado.id) {  
      produtoDto.id = produtoSelecionado.id;
      alterarProduto(produtoDto, {
        onSuccess: (produto: Produto) => {
            setMensagem("Produto alterado com sucesso.");
            navigate("/produtos/" + produto.id);
        }
      })
    } else {
      cadastrarProduto(produtoDto, {
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
    <form onSubmit={handleSubmit(submit)} className="mt-6" autoComplete="off">
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
              {errors.nome && <span className="text-red-700 font-semibold text-sm">{errors.nome.message}</span>}
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
              {errors.descricao && <span className="text-red-700 font-semibold text-sm">{errors.descricao.message}</span>}
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
                {...register("categoria", { valueAsNumber: true })}
                // id="categoria"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              >
                <option value="0">Selecione uma categoria</option>
                <option value="1">Fruta</option>
                <option value="2">Legume</option>
                <option value="3">Verdura</option>
              </select>
              {errors.categoria && <span className="text-red-700 font-semibold text-sm">{errors.categoria.message}</span>}
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
              {errors.data_cadastro && <span className="text-red-700 font-semibold text-sm">{errors.data_cadastro.message}</span>}
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
              {errors.preco && <span className="text-red-700 font-semibold text-sm">{errors.preco.message}</span>}
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
              {errors.qtd_estoque && <span className="text-red-700 font-semibold text-sm">{errors.qtd_estoque.message}</span>}
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
              {errors.imagem && <span className="text-red-700 font-semibold text-sm">{errors.imagem.message}</span>}
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
                onClick={inicializarForm}
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

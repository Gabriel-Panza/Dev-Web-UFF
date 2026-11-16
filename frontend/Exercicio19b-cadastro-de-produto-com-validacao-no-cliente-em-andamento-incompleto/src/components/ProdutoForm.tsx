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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import isCategoriaValida from "../util/isCategoriaValida";
import isDataValida from "../util/isDataValida";

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
    .refine((val) => Number.isFinite(+val) && +val > 0.10, {message: "O 'preço' deve ser > 0,10"}),
  qtd_estoque: z
    .string()
    .nonempty("A 'quantidade em estoque' deve ser informada")
    .refine(
      (val) => Number.isInteger(+val) && +val >= 0 && +val <= 2147483647,
      "A 'quantidade em estoque' deve ser um inteiro entre 0 e 2147483647.",
    ),
  imagem: z
    .string()
    .nonempty("A 'imagem' deve ser informada.")
    // Expressão regular só funciona se o tipo no zod for string
    // e no html o input for type="text".
    .regex(regexImagem, { message: "Nome de imagem inválido." }),
  disponivel: z.boolean(),
});

type FormProduto = z.infer<typeof schema>;

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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormProduto>({
    defaultValues: produtoInicial,
    resolver: zodResolver(schema),
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
              htmlFor="nome"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Nome
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("nome")}
                type="text"
                id="nome"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? "nome-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.nome && (
                <p id="nome-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.nome.message}
                </p>
              )}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              htmlFor="descricao"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Descrição
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("descricao")}
                type="text"
                id="descricao"
                aria-invalid={!!errors.descricao}
                aria-describedby={errors.descricao ? "descricao-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.descricao && (
                <p id="descricao-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.descricao.message}
                </p>
              )}
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              htmlFor="categoria"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Categoria
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <select
                {...register("categoria", { setValueAs: Number })}
                id="categoria"
                aria-invalid={!!errors.categoria}
                aria-describedby={errors.categoria ? "categoria-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              >
                <option value="0">Selecione uma categoria</option>
                <option value="1">Fruta</option>
                <option value="2">Legume</option>
                <option value="3">Verdura</option>
              </select>
              {errors.categoria && (
                <p id="categoria-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.categoria.message}
                </p>
              )}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              htmlFor="data_cadastro"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              <span className="hidden md:block">Data Cad.</span>
              <span className="md:hidden">Data de Cadastro</span>
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("data_cadastro")}
                type="date"
                id="data_cadastro"
                aria-invalid={!!errors.data_cadastro}
                aria-describedby={errors.data_cadastro ? "data_cadastro-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.data_cadastro && (
                <p id="data_cadastro-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.data_cadastro.message}
                </p>
              )}
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              htmlFor="preco"
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
                id="preco"
                aria-invalid={!!errors.preco}
                aria-describedby={errors.preco ? "preco-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.preco && (
                <p id="preco-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.preco.message}
                </p>
              )}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              htmlFor="qtd_estoque"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Estoque
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("qtd_estoque")}
                type="number"
                min="0"
                id="qtd_estoque"
                aria-invalid={!!errors.qtd_estoque}
                aria-describedby={errors.qtd_estoque ? "qtd_estoque-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.qtd_estoque && (
                <p id="qtd_estoque-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.qtd_estoque.message}
                </p>
              )}
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label
              htmlFor="imagem"
              className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold"
            >
              Imagem
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("imagem")}
                type="text"
                id="imagem"
                aria-invalid={!!errors.imagem}
                aria-describedby={errors.imagem ? "imagem-erro" : undefined}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.imagem && (
                <p id="imagem-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.imagem.message}
                </p>
              )}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <div className="flex items-center col-span-9 lg:col-start-4 xl:col-start-3">
              <input
                {...register("disponivel")}
                type="checkbox"
                id="disponivel"
                aria-invalid={!!errors.disponivel}
                aria-describedby={errors.disponivel ? "disponivel-erro" : undefined}
                className="form-checkbox mr-2 h-4 w-4 text-blue-600"
              />
              <label 
                htmlFor="disponivel" 
                className="col-span-3 xl:col-span-2 mb-1 flex items-center font-bold">
                Disponível?
              </label>
              {errors.disponivel && (
                <p id="disponivel-erro" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.disponivel.message}
                </p>
              )}
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

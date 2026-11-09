import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import dayjs from "dayjs";
import databaseAdd from "../assets/skin/database_add.png";
import databaseSave from "../assets/skin/database_save.png";
import type { Produto } from "../interfaces/Produto";
import type { ProdutoForm as ProdutoFormDados } from "../interfaces/ProdutoForm";
import useCadastrarProduto from "../hooks/useCadastrarProduto";
import useAlterarProduto from "../hooks/useAlterarProduto";
import converterProdutoForm from "../util/converterProdutoForm";

interface Props {
  produto?: Produto;
}

const ProdutoForm = ({ produto }: Props) => {
  const [mensagem, setMensagem] = useState("");
  const [idAlterado, setIdAlterado] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProdutoFormDados>({
    defaultValues: {
      nome: produto?.nome ?? "",
      descricao: produto?.descricao ?? "",
      categoria: produto?.categoria.id ?? 0,
      qtd_estoque: produto ? String(produto.qtdEstoque) : "",
      data_cadastro: produto
        ? dayjs(produto.dataCadastro).format("YYYY-MM-DD")
        : "",
      preco: produto ? String(produto.preco) : "",
      imagem: produto?.imagem ?? "",
      disponivel: produto?.disponivel ?? false,
    },
  });
  const cadastro = useCadastrarProduto();
  const alteracao = useAlterarProduto();
  const salvando = cadastro.isPending || alteracao.isPending;
  const erro = produto ? alteracao.error : cadastro.error;

  const tratarSubmit = (dados: ProdutoFormDados) => {
    if (salvando) return;
    setMensagem("");
    const novoProduto = converterProdutoForm(dados);
    if (produto) {
      alteracao.mutate(
        { ...novoProduto, id: produto.id },
        {
          onSuccess: (salvo) => setIdAlterado(salvo.id),
        },
      );
    } else {
      cadastro.mutate(novoProduto, {
        onSuccess: (salvo) => {
          setMensagem("Produto " + salvo.nome + " cadastrado com sucesso.");
          reset();
        },
      });
    }
  };

  if (idAlterado !== null)
    return <Navigate to={"/produtos/" + idAlterado} replace />;

  return (
    <form
      className="mt-6"
      autoComplete="off"
      onSubmit={handleSubmit(tratarSubmit)}
      aria-busy={salvando}
    >
      {mensagem && (
        <div
          role="status"
          className="mb-3 border-2 border-yellow-500 bg-yellow-100 px-4 py-3 font-semibold text-yellow-900"
        >
          {mensagem}
        </div>
      )}
      {erro && (
        <div
          role="alert"
          className="mb-3 rounded border-2 border-red-600 bg-red-100 px-4 py-3 font-bold text-red-800"
        >
          {erro.message}
        </div>
      )}
      <fieldset disabled={salvando}>
        {/* Duas colunas em telas grandes; campos empilhados em telas pequenas. */}
        <div className="grid grid-cols-12 gap-1 lg:gap-6">
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="nome"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                Nome
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <input
                  {...register("nome", {
                    required: "Informe o nome.",
                    validate: (value) => !!value.trim() || "Informe o nome.",
                  })}
                  type="text"
                  id="nome"
                  aria-invalid={!!errors.nome}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                />
                {errors.nome && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.nome.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="descricao"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                Descrição
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <input
                  {...register("descricao", {
                    required: "Informe a descrição.",
                    validate: (value) =>
                      !!value.trim() || "Informe a descrição.",
                  })}
                  type="text"
                  id="descricao"
                  aria-invalid={!!errors.descricao}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                />
                {errors.descricao && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.descricao.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 lg:gap-6">
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="categoria"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                Categoria
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <select
                  {...register("categoria", {
                    valueAsNumber: true,
                    validate: (value) =>
                      [1, 2, 3].includes(value) || "Selecione uma categoria.",
                  })}
                  id="categoria"
                  aria-invalid={!!errors.categoria}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                >
                  <option value="0">Selecione uma categoria</option>
                  <option value="1">Fruta</option>
                  <option value="2">Legume</option>
                  <option value="3">Verdura</option>
                </select>
                {errors.categoria && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.categoria.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="data_cadastro"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                <span className="hidden md:block">Data Cad.</span>
                <span className="md:hidden">Data de Cadastro</span>
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <input
                  {...register("data_cadastro", {
                    required: "Informe a data de cadastro.",
                  })}
                  type="date"
                  id="data_cadastro"
                  aria-invalid={!!errors.data_cadastro}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                />
                {errors.data_cadastro && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.data_cadastro.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 lg:gap-6">
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="preco"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                Preço
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <input
                  {...register("preco", {
                    required: "Informe o preço.",
                    min: { value: 0.1, message: "O preço mínimo é 0,10." },
                    validate: (value) =>
                      Number.isFinite(Number(value)) ||
                      "Informe um preço válido.",
                  })}
                  type="number"
                  step="0.01"
                  min="0.10"
                  id="preco"
                  aria-invalid={!!errors.preco}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                />
                {errors.preco && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.preco.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="qtd_estoque"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                Estoque
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <input
                  {...register("qtd_estoque", {
                    required: "Informe o estoque.",
                    min: {
                      value: 0,
                      message: "O estoque não pode ser negativo.",
                    },
                    max: {
                      value: 2147483647,
                      message: "Estoque acima do limite permitido.",
                    },
                    validate: (value) =>
                      Number.isInteger(Number(value)) ||
                      "Informe um estoque inteiro.",
                  })}
                  type="number"
                  min="0"
                  step="1"
                  id="qtd_estoque"
                  aria-invalid={!!errors.qtd_estoque}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                />
                {errors.qtd_estoque && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.qtd_estoque.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 lg:gap-6">
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <label
                htmlFor="imagem"
                className="col-span-12 mb-1 flex items-center font-bold lg:col-span-3 xl:col-span-2"
              >
                Imagem
              </label>
              <div className="col-span-12 lg:col-span-9 xl:col-span-10">
                <input
                  {...register("imagem", {
                    required: "Informe o nome da imagem.",
                    validate: (value) =>
                      !!value.trim() || "Informe o nome da imagem.",
                  })}
                  type="text"
                  id="imagem"
                  aria-invalid={!!errors.imagem}
                  className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500"
                />
                {errors.imagem && (
                  <p role="alert" className="text-sm text-red-800">
                    {errors.imagem.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <div className="col-span-9 flex items-center lg:col-start-4 xl:col-start-3">
                <input
                  {...register("disponivel")}
                  type="checkbox"
                  id="disponivel"
                  className="form-checkbox mr-2 h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="disponivel"
                  className="col-span-3 mb-1 flex items-center font-bold xl:col-span-2"
                >
                  Disponível?
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-12 gap-1">
          <div className="col-span-12 mb-1 lg:col-span-6 lg:mb-3">
            <div className="grid grid-cols-12">
              <div className="col-span-12 lg:col-start-4 xl:col-start-3">
                <button
                  type="submit"
                  disabled={salvando}
                  className="btn-success flex items-center justify-center px-5 py-1.5"
                >
                  {salvando ? (
                    <span
                      aria-hidden="true"
                      className="me-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                    ></span>
                  ) : (
                    <img
                      src={produto ? databaseSave : databaseAdd}
                      className="me-2"
                      alt=""
                    />
                  )}
                  {salvando
                    ? "Salvando..."
                    : produto
                      ? "Salvar alterações"
                      : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
};
export default ProdutoForm;

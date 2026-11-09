import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";

const require = createRequire(import.meta.url);
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const modulo = (valor) => ({ __esModule: true, default: valor });
const dados = {
  nome: " Abacate ",
  descricao: " 1 unidade ",
  categoria: 1,
  qtd_estoque: "0",
  data_cadastro: "2025-04-26",
  preco: "2.45",
  imagem: " abacate.png ",
  disponivel: false,
};
const esperado = {
  nome: "Abacate",
  descricao: "1 unidade",
  categoria: { id: 1 },
  qtdEstoque: 0,
  dataCadastro: "2025-04-26",
  preco: 2.45,
  imagem: "abacate.png",
  disponivel: false,
};
const admin = { token: "1", idUsuario: 1, nome: "admin", role: "ADMIN" };

// Executa os módulos reais, substituindo apenas as dependências de React/HTTP nos testes.
function carregar(caminho, mocks = {}) {
  const arquivo = resolve(raiz, caminho);
  const js = ts.transpileModule(readFileSync(arquivo, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const resultado = { exports: {} };
  const resolver = (nome) => {
    if (nome in mocks) return mocks[nome];
    if (/\.(png|css)$/.test(nome)) return modulo("/asset.png");
    if (nome.startsWith(".")) {
      const base = resolve(dirname(arquivo), nome);
      try {
        return carregar(base + ".ts", mocks);
      } catch (erro) {
        if (erro.code !== "ENOENT") throw erro;
        return carregar(base + ".tsx", mocks);
      }
    }
    return require(nome);
  };
  new Function("require", "module", "exports", js)(
    resolver,
    resultado,
    resultado.exports,
  );
  return resultado.exports.default;
}

test("converte os oito campos sem ID, preservando zero, false e data ISO", () => {
  const converter = carregar("src/util/converterProdutoForm.ts");
  assert.deepEqual(converter(dados), esperado);
  assert.deepEqual(
    converter({ ...dados, categoria: 3, qtd_estoque: "12", disponivel: true }),
    {
      ...esperado,
      categoria: { id: 3 },
      qtdEstoque: 12,
      disponivel: true,
    },
  );
});

for (const [nome, metodo] of [
  ["Cadastrar", "POST"],
  ["Alterar", "PUT"],
]) {
  test(`${nome}: payload, permissão, resposta HTTP e invalidação de todas as listas`, async (t) => {
    let tokenResponse = admin;
    let chamadas = 0;
    let invalidacao;
    const tokenStore = { getState: () => ({ tokenResponse }) };
    const hook = carregar(`src/hooks/use${nome}Produto.ts`, {
      "@tanstack/react-query": {
        useMutation: (options) => options,
        useQueryClient: () => ({
          invalidateQueries: async (options) => {
            invalidacao = options;
          },
        }),
      },
      "../store/TokenStore": modulo(tokenStore),
    });
    const mutation = hook();
    const produto = metodo === "PUT" ? { ...esperado, id: 9 } : esperado;
    t.mock.method(globalThis, "fetch", async (url, options) => {
      chamadas++;
      assert.equal(url, "/api/produtos");
      assert.equal(options.method, metodo);
      assert.equal(options.headers["Content-type"], "application/json");
      assert.deepEqual(JSON.parse(options.body), produto);
      return Response.json({ ...produto, id: 9 });
    });
    assert.equal((await mutation.mutationFn(produto)).id, 9);
    assert.equal(mutation.retry, false);
    await mutation.onSuccess();
    assert.deepEqual(invalidacao, { queryKey: ["produtos"], exact: false });
    for (const role of ["USER", ""]) {
      tokenResponse = { ...admin, role };
      await assert.rejects(mutation.mutationFn(produto), /administradores/);
    }
    assert.equal(chamadas, 1);
    tokenResponse = admin;
    t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("erro", { status: 500 }),
    );
    await assert.rejects(mutation.mutationFn(produto), /Status code: 500/);
  });
}

function montarForm(produto, pendente = false) {
  const registros = {};
  const chamadas = [];
  const estados = [];
  let defaults;
  let resets = 0;
  const mutation = (modo) => ({
    isPending: pendente,
    error: null,
    mutate: (payload, options) => chamadas.push({ modo, payload, options }),
  });
  const Form = carregar("src/components/ProdutoForm.tsx", {
    react: { useState: (inicial) => [inicial, (valor) => estados.push(valor)] },
    "react-hook-form": {
      useForm: (options) => {
        defaults = options.defaultValues;
        return {
          register: (nome, regras) => {
            registros[nome] = regras;
            return { name: nome };
          },
          handleSubmit: (callback) => callback,
          reset: () => {
            resets++;
          },
          formState: { errors: {} },
        };
      },
    },
    "../hooks/useCadastrarProduto": modulo(() => mutation("cadastro")),
    "../hooks/useAlterarProduto": modulo(() => mutation("alteracao")),
  });
  const arvore = Form({ produto });
  return {
    registros,
    chamadas,
    estados,
    defaults,
    arvore,
    resets: () => resets,
  };
}

test("formulário registra os oito campos e rejeita categoria 0, espaços e estoque fracionário", () => {
  const form = montarForm();
  assert.deepEqual(
    Object.keys(form.registros).sort(),
    Object.keys(dados).sort(),
  );
  assert.notEqual(form.registros.categoria.validate(0), true);
  assert.equal(form.registros.categoria.validate(2), true);
  assert.equal(form.registros.categoria.valueAsNumber, true);
  assert.notEqual(form.registros.nome.validate("   "), true);
  assert.notEqual(form.registros.qtd_estoque.validate("1.5"), true);
  assert.equal(form.registros.qtd_estoque.validate("0"), true);
  assert.equal(form.registros.preco.min.value, 0.1);
  assert.equal(form.registros.qtd_estoque.min.value, 0);
  assert.ok(form.registros.data_cadastro.required);
});

test("cadastro envia dados convertidos e só limpa o formulário após sucesso", () => {
  const form = montarForm();
  form.arvore.props.onSubmit(dados);
  assert.equal(form.chamadas[0].modo, "cadastro");
  assert.deepEqual(form.chamadas[0].payload, esperado);
  assert.equal(form.resets(), 0);
  form.chamadas[0].options.onSuccess({ ...esperado, id: 9 });
  assert.equal(form.resets(), 1);
  assert.ok(form.estados.includes("Produto Abacate cadastrado com sucesso."));
});

test("edição preenche os campos e preserva o ID e o false ao enviar", () => {
  const produto = { ...esperado, id: 9, categoria: { id: 1, nome: "Fruta" } };
  const form = montarForm(produto);
  assert.equal(form.defaults.data_cadastro, "2025-04-26");
  assert.equal(form.defaults.qtd_estoque, "0");
  assert.equal(form.defaults.disponivel, false);
  form.arvore.props.onSubmit(dados);
  assert.equal(form.chamadas[0].modo, "alteracao");
  assert.deepEqual(form.chamadas[0].payload, { ...esperado, id: 9 });
  form.chamadas[0].options.onSuccess(produto);
  assert.ok(form.estados.includes(9));
});

test("formulário não envia outra mutation enquanto há uma operação pendente", () => {
  const form = montarForm(undefined, true);
  form.arvore.props.onSubmit(dados);
  assert.equal(form.chamadas.length, 0);
  assert.equal(form.arvore.props["aria-busy"], true);
});

test("cadastro e alteração ficam no grupo apenasAdmin e preservam as rotas de usuários logados", () => {
  const componente = () => null;
  const PrivateRoutes = () => null;
  const paginas = [
    "CarrinhoPage",
    "FavoritosPage",
    "HomePage",
    "CadastrarProdutoPage",
    "AlterarProdutoPage",
    "LoginPage",
    "Errorpage",
    "ProdutoPage",
    "ProdutosComPaginacaoPage",
  ];
  const mocks = {
    "react-router-dom": { createBrowserRouter: (config) => config },
    "./Layout": modulo(componente),
    "./PrivateRoutes": modulo(PrivateRoutes),
    "./DefaultRoute": modulo(componente),
  };
  for (const pagina of paginas)
    mocks["../pages/" + pagina] = modulo(componente);
  const router = carregar("src/routes/router.tsx", mocks);
  const privadas = router[0].children.find(
    (rota) => rota.element?.type === PrivateRoutes,
  );
  assert.deepEqual(
    privadas.children.filter((rota) => rota.path).map((rota) => rota.path),
    ["favoritos", "produtos/:id"],
  );
  const grupoAdmin = privadas.children.find(
    (rota) => rota.element?.props.apenasAdmin,
  );
  assert.deepEqual(
    grupoAdmin.children.map((rota) => rota.path),
    ["cadastrar-produto", "alterar-produto/:id"],
  );
});

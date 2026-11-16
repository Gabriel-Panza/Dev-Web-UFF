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
  let resolverForm;
  let resets = 0;
  const mutation = (modo) => ({
    isPending: pendente,
    error: null,
    mutate: (payload, options) => chamadas.push({ modo, payload, options }),
  });
  const Form = carregar("src/components/ProdutoForm.tsx", {
    "react-router-dom": { useNavigate: () => () => {}, Navigate: () => null },
    react: { useState: (inicial) => [inicial, (valor) => estados.push(valor)] },
    "react-hook-form": {
      useForm: (options) => {
        defaults = options.defaultValues;
        resolverForm = options.resolver;
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
    validar: (valores) =>
      resolverForm(valores, undefined, {
        criteriaMode: "all",
        shouldUseNativeValidation: false,
      }),
  };
}

test("formulário registra os oito campos e usa o resolver Zod para categoria, nome, data, preço e estoque", async () => {
  const form = montarForm();
  assert.deepEqual(
    Object.keys(form.registros).sort(),
    Object.keys(dados).sort(),
  );
  assert.equal(form.registros.categoria.valueAsNumber, true);
  const valido = await form.validar(dados);
  assert.deepEqual(valido.errors, {});
  assert.equal(valido.values.nome, "Abacate");
  const invalido = await form.validar({
    ...dados,
    nome: "123",
    categoria: 0,
    qtd_estoque: "1.5",
    data_cadastro: "2025-02-30",
    preco: "0.10",
    imagem: "Abacate.png",
  });
  for (const campo of [
    "nome",
    "categoria",
    "qtd_estoque",
    "data_cadastro",
    "preco",
    "imagem",
  ])
    assert.ok(invalido.errors[campo], campo);
  assert.equal(form.arvore.props.noValidate, true);
});

test("schema aceita texto com números, preço decimal, estoque zero e false", () => {
  const schema = carregar("src/schemas/produtoSchema.ts");
  for (const nome of ["Abacate", "Abóbora 2026", "Produto 18"]) {
    const resultado = schema.safeParse({ ...dados, nome, preco: "0.11" });
    assert.equal(resultado.success, true, nome);
    assert.equal(resultado.data.disponivel, false);
  }
});

test("schema rejeita valores incompatíveis com cada campo e datas inexistentes", (t) => {
  t.mock.method(console, "log", () => {});
  const schema = carregar("src/schemas/produtoSchema.ts");
  const invalidos = {
    nome: ["", "  ", "Ab", "1234", "###", "a".repeat(256)],
    descricao: ["", "  "],
    categoria: [0, -1, 4, 1.5, "1", Number.NaN],
    data_cadastro: [
      "",
      "2025-02-29",
      "2025-02-30",
      "2026-04-31",
      "2026-13-01",
      "2026/11/14",
      "14/11/2026",
      "2026-1-1",
    ],
    preco: [
      "",
      "abc",
      "0",
      "-1",
      "0.10",
      "0.09",
      "NaN",
      "Infinity",
      "1e3",
      "2.456",
      "1,50",
    ],
    qtd_estoque: ["", "-1", "1.5", "abc", "1e2", "Infinity", "2147483648"],
    imagem: [
      "",
      "Foto.png",
      "foto1.png",
      "foto.jpeg",
      "foto.webp",
      "../foto.png",
      "foto.png.exe",
    ],
    disponivel: ["true", "false", 1, null],
  };
  for (const [campo, valores] of Object.entries(invalidos)) {
    for (const valor of valores) {
      const resultado = schema.safeParse({ ...dados, [campo]: valor });
      assert.equal(resultado.success, false, `${campo}: ${valor}`);
      assert.ok(
        resultado.error.issues.some((issue) => issue.path[0] === campo),
        campo,
      );
    }
  }
  assert.equal(
    schema.safeParse({ ...dados, data_cadastro: "2024-02-29" }).success,
    true,
  );
  for (const imagem of ["foto.gif", "foto.jpg", "foto.png", "foto.bmp"]) {
    assert.equal(schema.safeParse({ ...dados, imagem }).success, true, imagem);
  }
});

test("dados inválidos não chegam à mutation e não apagam o formulário", () => {
  const form = montarForm();
  assert.throws(() => form.arvore.props.onSubmit({ ...dados, preco: "abc" }));
  assert.equal(form.chamadas.length, 0);
  assert.equal(form.resets(), 0);
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

test("edição permite trocar os oito campos tanto em um produto inicial quanto em um recém-criado", () => {
  const novosDados = {
    nome: "Produto 18",
    descricao: "Novo pacote",
    categoria: 2,
    qtd_estoque: "42",
    data_cadastro: "2026-11-14",
    preco: "8.75",
    imagem: "banana.jpg",
    disponivel: true,
  };
  for (const id of [1, 1000]) {
    const produto = { ...esperado, id, categoria: { id: 1, nome: "Fruta" } };
    const form = montarForm(produto);
    form.arvore.props.onSubmit(novosDados);
    assert.deepEqual(form.chamadas[0].payload, {
      id,
      nome: "Produto 18",
      descricao: "Novo pacote",
      categoria: { id: 2 },
      qtdEstoque: 42,
      dataCadastro: "2026-11-14",
      preco: 8.75,
      imagem: "banana.jpg",
      disponivel: true,
    });
    assert.equal(form.chamadas[0].modo, "alteracao");
  }
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

# Exercício 17 — Cadastro de produto parcialmente completo

## Executar

Terminal 1 (MySQL ligado):

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\backend\Exercicio14-apirestfulv2
& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run
```

Terminal 2:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\frontend\Exercicio17-cadastro-produto-parcialmente-completo
npm install
npm run dev
```

Entre como `admin`, senha `desweb` (credenciais iniciais). Abra **Cad. Produto** para cadastrar. Para editar, abra um produto pela listagem e clique em **Editar**. O exercício 16 foi preservado.

## Cadastro e alteração

- `CadastrarProdutoPage` usa `ProdutoForm`, com os oito campos e o grid do roteiro.
- A interface `ProdutoForm` mantém `categoria` numérica e `qtd_estoque`, `data_cadastro` e `preco` em texto, como no roteiro. React Hook Form faz o registro com spread e as validações básicas.
- `converterProdutoForm` prepara o payload da API: `categoria: { id }`, `qtdEstoque` e `preco` numéricos, `dataCadastro` em `YYYY-MM-DD`. O POST não envia ID; o PUT mantém o ID original.
- `useCadastrarProduto` faz POST em `/api/produtos` e `useAlterarProduto` faz PUT na mesma URL. O proxy encaminha para `http://localhost:8080/produtos`.
- As duas mutations invalidam todas as queries iniciadas por `["produtos"]`. Elas usam `useQueryClient` para acessar o mesmo client do provider, sem criar um import circular de `main.tsx`.
- O cadastro mostra uma confirmação e limpa os campos somente após sucesso. Falhas preservam os dados para nova tentativa. O formulário fica desabilitado enquanto salva.
- `AlterarProdutoPage` carrega o produto em `/alterar-produto/:id` e reaproveita o formulário preenchido. Depois de salvar, retorna aos detalhes com `<Navigate />`.
- Cadastro e alteração são exclusivos do admin; os hooks também verificam o perfil antes de enviar POST/PUT. Isso não substitui autorização no servidor.

As opções de categoria seguem o roteiro: 1 = Fruta, 2 = Legume e 3 = Verdura. Elas pressupõem a carga inicial padrão do backend. O campo Imagem recebe o nome de um arquivo existente em `public/`, por exemplo `abacate.png`; não há upload de arquivos. Não foram acrescentados cadastro de categorias, JWT ou recuperação de senha.

## Validação

Dentro desta pasta:

```powershell
npm run build
npm run lint
npm test
```

Os testes do frontend usam HTTP e hooks de React simulados para conferir conversão, validações, mutations, cache e preenchimento do formulário. O backend tem um teste HTTP de POST/PUT/GET com H2 em memória (`ProdutoCadastroHttpTest`), sem alterar o MySQL real.

## Login e permissões herdados do exercício 16

Execute o backend do exercício 14 na porta 8080 e este frontend com `npm install` e `npm run dev`. Abra `/login` pelo link Entrar.

O formulário usa `email` e `senha` no frontend. O hook envia `POST /api/autenticacao/login` traduzindo `email` para `conta`, como exige o backend atual. O proxy do Vite encaminha a chamada para o backend. A resposta tem quatro campos: `token` (string), `idUsuario`, `nome` e `role`. Login inválido retorna token vazio e ID zero. Reinicie o backend 14 após atualizar esse contrato.

O hook `useEfetuarLogin` usa uma mutation do React Query, `TokenStore` guarda a resposta e `LoginStore` guarda a mensagem. O formulário usa React Hook Form, `register` e spread conforme o roteiro. O campo `email` do `LoginForm` representa a conta (não exige formato de e-mail). A navbar mostra o nome retornado e permite sair. O estado não é persistido: atualizar a página exige entrar novamente. Nenhuma senha é gravada nos stores ou no armazenamento do navegador.

Se a carga inicial não foi alterada, informe `admin` (ou `user`) no campo E-mail e `desweb` na senha. O backend ainda não cadastra e-mails reais, por isso o campo aceita esses identificadores sem exigir o formato `nome@dominio`.

Este backend ainda não implementa JWT, sessão autenticada ou autorização dos endpoints. O token é o ID convertido em texto e `nome` usa a conta. O backend atribui `role: "ADMIN"` à conta autenticada `admin` e `"USER"` às demais. Os links de recuperação de senha e cadastro são placeholders do roteiro.

Na entrada `/`, `DefaultRoute` redireciona usuários logados para `/home` e visitantes para `/login`. Ao sair, o usuário também volta para o login. As páginas comuns (`/home`, `/carrinho` e `/listar-produtos`) continuam públicas quando acessadas diretamente.

Quando um visitante tenta uma página privada, `PrivateRoutes` usa `<Navigate to="/login" state={{ from: location }} replace />` para guardar a localização anterior. Após o login, a página usa `<Navigate />` para voltar ao caminho tentado, incluindo query string e fragmento. Login direto, sem uma página anterior válida, leva a `/home`. O destino deve ser interno e as permissões continuam valendo: um `USER` que tentou cadastrar um produto será redirecionado à home pelo grupo exclusivo de admin. O retorno fica no estado do histórico, não em um store persistente.

Ao clicar em Sair, a navbar também guarda a localização atual em `state.from` antes de abrir o login. Assim, sair de `/listar-produtos` e entrar novamente retorna à listagem. A mesma regra vale para páginas privadas: o novo usuário precisa ter permissão para a página guardada; caso contrário, `PrivateRoutes` o redireciona para a home.

`PrivateRoutes` usa `Outlet` e agrupa em `children` as rotas `/favoritos` e `/produtos/:id`, disponíveis para qualquer usuário logado, inclusive `USER`. O grupo interno com `apenasAdmin` restringe `/cadastrar-produto` e `/alterar-produto/:id` ao `ADMIN`. Visitantes vão para `/login`; usuários comuns tentando cadastrar ou editar vão para `/home`, inclusive ao digitar a URL diretamente.

A navbar mostra Favoritos para todos os logados e Cad. Produto apenas ao admin. A tabela permite abrir detalhes para qualquer logado, mas só mostra a coluna de ações e o botão Remover ao admin. Os botões Editar e Remover na página de produto também são exclusivos do admin. O hook de remoção confere o perfil novamente antes de enviar o DELETE, inclusive se o usuário sair durante a espera.

Essas restrições são somente de navegação no frontend; não protegem as operações da API contra chamadas HTTP diretas. É necessário implementar autorização no servidor para segurança real.

Validação: `npm run build` e `npm run lint`.

## Documentação do template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

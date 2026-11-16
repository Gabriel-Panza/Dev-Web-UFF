# Desenvolvimento Web — UFF

Repositório de exercícios da disciplina de Desenvolvimento Web da Universidade Federal Fluminense (UFF). As atividades acompanham a construção gradual de aplicações Java e de uma interface de produtos de hortifruti: persistência no banco, API REST, componentes React, requisições assíncronas, cache, pesquisa, paginação, remoção, login, cadastro, edição e validação.

Cada exercício preserva uma etapa da disciplina. Não é uma aplicação única que exige iniciar todas as pastas. Escolha uma atividade e execute somente seu frontend e, quando necessário, o backend correspondente. Termos como `incompleto` e `parcialmente-completo` fazem parte dos nomes das atividades e não significam que todas as telas ilustrativas estejam implementadas.

Este README concentra a documentação do repositório. Os comandos usam **PowerShell no Windows**.

## Sumário

- [Organização e dependências](#organização-e-dependências)
- [Preparar o ambiente](#preparar-o-ambiente)
- [Execução em dois terminais](#execução-em-dois-terminais)
- [Fluxo de cada exercício](#fluxo-de-cada-exercício)
- [Login e permissões](#login-e-permissões)
- [Cadastro, edição e imagens](#cadastro-edição-e-imagens)
- [Banco e carga inicial](#banco-e-carga-inicial)
- [Testes e compilação](#testes-e-compilação)
- [Mappers e organização do código](#mappers-e-organização-do-código)
- [Problemas comuns](#problemas-comuns)
- [Conceitos e documentação de apoio](#conceitos-e-documentação-de-apoio)

## Organização e dependências

```text
Dev-Web-UFF/
├── backend/
│   ├── Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/
│   ├── Exercicio02-apirestful/
│   └── Exercicio14-apirestfulv2/
├── frontend/
│   ├── Exercicio03-react/
│   ├── Exercicio04-navbar/
│   ├── Exercicio05-produtos/
│   ├── Exercicio06-sync-assync/
│   │   ├── await-try-catch/
│   │   └── fetch-then-then-catch/
│   ├── Exercicio07-react-query/
│   ├── Exercicio08-produto/
│   ├── Exercicio09-pesquisa_produto/
│   ├── Exercicio10-removendo_produto/
│   ├── Exercicio11-removendo_produto_otimista-incompleto/
│   ├── Exercicio12-removendo_produto_com_id/
│   ├── Exercicio13-zustand-incompleto/
│   ├── Exercicio15-zustand-com-nova-api/
│   ├── Exercicio16-login-parcialmente-completo/
│   ├── Exercicio17-cadastro-produto-parcialmente-completo/
│   ├── Exercicio18-edicao-produtos-parcialmente-completo/
│   ├── Exercicio19a-cadastro-de-produto-sem-nenhuma-validacao/
│   └── Exercicio19b-cadastro-de-produto-com-validacao-no-cliente-em-andamento-incompleto/
├── pom.xml
├── LICENSE
└── README.md
```

| Atividade | Como executar                            | Dependência                                  |
| --------- | ---------------------------------------- | -------------------------------------------- |
| 01        | Aplicação Java no console, sem navegador | Banco de dados                               |
| 02        | Primeira API REST                        | Banco de dados; atende os frontends 06 a 13  |
| 03 a 05   | Somente frontend                         | Não precisam de API nem banco                |
| 06 a 13   | Backend + frontend, em dois terminais    | Backend 02 e banco                           |
| 14        | Segunda API REST                         | Banco de dados; atende os frontends 15 a 19b |
| 15 a 19b  | Backend + frontend, em dois terminais    | Backend 14 e banco                           |

**A primeira integração com backend começa no frontend 06. A troca para o backend novo acontece no frontend 15.** Os números 02 e 14 identificam as atividades de criação das APIs; por isso, não foram renomeados para 06 e 15.

O exercício 01 está em `backend/` por ser Java com persistência, mas **não é um servidor HTTP**. O exercício 14 é uma atividade de backend, sem frontend de número 14.

As duas APIs usam a porta `8080`. Execute apenas uma por vez. As versões React normalmente usam `5173`; para seguir os exemplos sem conflito, execute um frontend por vez.

## Preparar o ambiente

### 1. Abrir o repositório

Extraia o ZIP ou clone o repositório. Abra o PowerShell na pasta que contém `backend/`, `frontend/` e o `pom.xml` da raiz.

Se necessário:

```powershell
cd "C:\CAMINHO\Dev-Web-UFF"
```

Substitua esse caminho pela pasta real. **Os comandos com `.\backend` e `.\frontend` neste README partem da raiz do repositório**, inclusive no segundo terminal.

### 2. Java, Node.js e Maven

- **Java JDK 25**, exigido pelos projetos Java.
- **Node.js 20.19 ou superior da linha 20, ou 22.12 ou superior**, conforme os requisitos dos pacotes Vite presentes. Node 22.12+ atende a este ambiente.
- **npm**, instalado com o Node.js.
- Acesso à internet na primeira instalação das dependências.

Confira:

```powershell
java -version
node -v
npm.cmd -v
```

O Java deve indicar versão 25. Se houver outro Java instalado, confira também `$env:JAVA_HOME` e `Get-Command java`: o terminal pode estar selecionando a instalação errada. Após instalar ou alterar o PATH, feche e reabra o PowerShell e o VS Code.

Se Java e Node ainda não estiverem instalados, em um Windows com WinGet disponível, abra o PowerShell como administrador:

```powershell
winget install --id EclipseAdoptium.Temurin.25.JDK --exact
winget install --id OpenJS.NodeJS.LTS --exact
```

Aceite os instaladores e reabra os terminais ao terminar. Se o próprio `winget` não for reconhecido, use os instaladores oficiais de [Temurin](https://adoptium.net/installation) e [Node.js](https://nodejs.org/en/download). Não execute esses comandos para substituir um ambiente já configurado sem antes conferir as versões.

**Não é obrigatório instalar Maven separado.** O backend 14 inclui o Maven Wrapper (`mvnw.cmd`), que baixa a versão configurada do Maven e também pode executar os outros POMs por meio de `-f`. Por isso, os exemplos abaixo não dependem de `MAVEN_HOME`.

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -version
```

Se preferir o Maven já instalado, substitua o caminho do wrapper por `mvn.cmd` ou `& "$env:MAVEN_HOME\bin\mvn.cmd"`, preservando os argumentos seguintes.

### 3. Dependências de cada frontend

O `package.json` e o `package-lock.json` pertencem a cada aplicação. Instalar os pacotes de uma atividade não instala os das outras.

Instale as dependências na primeira execução e depois de alterações de dependências. Nas execuções seguintes, execute `npm run dev` dentro da pasta que contém o `package.json`. Os exemplos com `npm.cmd --prefix PASTA` permitem executar o mesmo comando sem entrar na pasta. Se o PowerShell bloquear o `npm.ps1`, use `npm.cmd` no lugar de `npm`.

Não é preciso instalar React, Tailwind, React Query, Zustand, Zod ou React Hook Form globalmente: o npm baixa as dependências declaradas de cada projeto.

### 4. Banco de dados

Para Java/API, ligue o MySQL ou MariaDB na porta `3306`. No XAMPP, clique em **Start** na linha **MySQL**. O Apache do XAMPP não é necessário para estes exercícios.

Crie o banco se ele ainda não existir. Com o cliente no PATH e root sem senha:

```powershell
mysql -u root -e "CREATE DATABASE IF NOT EXISTS desweb CHARACTER SET utf8mb4;"
```

Se o root tiver senha, acrescente `-p` para informá-la interativamente. No XAMPP instalado em `C:\xampp`, o equivalente é:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS desweb CHARACTER SET utf8mb4;"
```

Os backends 02 e 14 tentam primeiro o servidor da UFF e usam o local como fallback. Os comandos rápidos abaixo **forçam localhost**, facilitando a execução fora da rede da universidade.

No backend 14, a senha local também pode ser informada por variável de ambiente, no mesmo terminal em que ele será iniciado:

```powershell
$env:DATABASE_PASSWORD = Read-Host "Senha do banco local"
```

Para o backend 02, use `$env:SPRING_DATASOURCE_PASSWORD` no lugar de `$env:DATABASE_PASSWORD`. O usuário padrão das APIs é `root`. Não altere usuários ou senhas de um banco compartilhado apenas para executar estes exercícios.

## Execução em dois terminais

### Versão mais recente: exercício 15+ e backend 14

Com o banco ligado, abra **dois terminais na raiz do repositório**.

**Terminal 1 — API:**

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -f .\backend\Exercicio14-apirestfulv2\pom.xml spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb"
```

Aguarde `Started ApirestfulApplication`. O backend ficará em `http://localhost:8080`; deixe esse terminal aberto.

**Terminal 2 — interface:**

```powershell
cd .\frontend\Exercicio...
npm install
npm run dev
```

Abra a URL que o Vite informar, normalmente `http://localhost:5174`. Entre como `admin`, senha `desweb`, se a carga inicial não foi alterada. O campo E-mail aceita esse identificador, pois o backend ainda o chama de `conta`.

Substitua `Exercicio...` pela pasta da atividade, conforme os comandos abaixo. Nos exercícios **19a e 19b**, o `package.json` está diretamente na pasta do exercício.

Se a porta 5173 estiver ocupada, o Vite poderá iniciar em 5174 ou outra porta. Use a URL informada no terminal. O backend 14 permite requisições de desenvolvimento de `http://localhost` e `http://127.0.0.1` em portas alternativas. Após alterar essa configuração de CORS, reinicie a API.

### Exercícios 06 a 13 + backend 02

**Terminal 1 — API antiga:**

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -f .\backend\Exercicio02-apirestful\pom.xml spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb"
```

O wrapper pertence ao 14, mas **`-f` seleciona o projeto 02**: esse comando não inicia o backend 14.

**Terminal 2 — frontend escolhido**, por exemplo o exercício 09:

```powershell
npm.cmd --prefix .\frontend\Exercicio09-pesquisa_produto install
npm.cmd --prefix .\frontend\Exercicio09-pesquisa_produto run dev
```

O Vite encaminha requisições de `/api` para `http://localhost:8080`. Esse proxy é de desenvolvimento; uma publicação fora do Vite precisaria de configuração equivalente.

Para encerrar uma aplicação, pressione **Ctrl+C** no terminal dela. Pare a API atual antes de trocar entre 02 e 14.

## Fluxo de cada exercício

Os comandos desta seção partem da raiz. Para atividades com API, inicie primeiro o backend indicado na seção anterior.

### 01 — Java/JPA no console

**Pasta:** [backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto](backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/). Não usa frontend nem backend HTTP.

O script [Tabelas.sql](backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/script/Tabelas.sql) cria a estrutura de produtos do exercício e insere dois registros. **Ele contém DROP TABLE e seu modelo de produto é diferente do das APIs. Não o execute no banco usado pelos outros exercícios sem separar os dados ou fazer backup.** A URL dessa aplicação está em [persistence.xml](backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/src/main/resources/META-INF/persistence.xml).

Para executar após preparar o banco:

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -f .\backend\Exercicio01-Produto-Inclui-Altera-Exclui-incompleto\pom.xml compile exec:java "-Dexec.mainClass=com.carlosribeiro.Principal"
```

**Fluxo:** use o menu para cadastrar, alterar, remover ou listar produtos e escolha **Sair** para encerrar. O console pede nome, lance mínimo e data de cadastro no formato `dd/MM/yyyy`, por exemplo `14/11/2026`.

**Dependência particular:** o POM referencia `corejava:console:1.0`, que pode já existir na máquina usada em aula, mas não acompanha o repositório. Se o Maven informar que esse artefato está ausente, obtenha o JAR da biblioteca com o professor e instale-o localmente:

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -f .\backend\Exercicio01-Produto-Inclui-Altera-Exclui-incompleto\pom.xml install:install-file "-Dfile=C:\CAMINHO\console.jar" "-DgroupId=corejava" "-DartifactId=console" "-Dversion=1.0" "-Dpackaging=jar" "-DgeneratePom=true"
```

### 02 — primeira API REST

**Pasta:** [backend/Exercicio02-apirestful](backend/Exercicio02-apirestful/). Atende os frontends **06 a 13**.

Inicie com o comando do backend 02 em [Execução em dois terminais](#execução-em-dois-terminais). Não precisa iniciar um frontend para consultar a API.

**Fluxo:** a aplicação conecta ao banco, prepara a carga inicial quando necessário e expõe listagem, detalhe, pesquisa paginada e operações de produto. Acesse `http://localhost:8080/produtos` ou use [testes.http](backend/Exercicio02-apirestful/src/main/resources/testes.http). No navegador, abrir a URL faz GET; POST, PUT e DELETE precisam de um cliente HTTP.

A estrutura separa controllers, services, repositories, entidades, DTOs e mappers. As requisições da API retornam dados JSON; quem monta a interface é o React.

### 03 — introdução ao React

**Sem API nem banco.**

```powershell
npm.cmd --prefix .\frontend\Exercicio03-react install
npm.cmd --prefix .\frontend\Exercicio03-react run dev
```

**Fluxo:** abra a página inicial e interaja com o contador para observar a atualização do componente. A atividade mantém a base React/TypeScript/Vite e a recarga durante o desenvolvimento.

### 04 — navbar, rotas e estilos

**Sem API nem banco.**

```powershell
npm.cmd --prefix .\frontend\Exercicio04-navbar install
npm.cmd --prefix .\frontend\Exercicio04-navbar run dev
```

**Fluxo:** navegue pelos links da navbar para testar as rotas e o layout. As páginas são a estrutura inicial da interface; a presença de um link de login ou cadastro nesta etapa não significa que sua operação já esteja implementada.

### 05 — produtos locais

**Sem API nem banco.**

```powershell
npm.cmd --prefix .\frontend\Exercicio05-produtos install
npm.cmd --prefix .\frontend\Exercicio05-produtos run dev
```

**Fluxo:** abra **Listar Produtos** para visualizar a tabela, as categorias e as imagens. A lista está definida em TypeScript no próprio frontend; não é uma consulta ao MySQL. Botões desta etapa não devem ser confundidos com persistência via API.

### 06 — requisições com then/catch e async/await

**Requer backend 02. É a primeira atividade React que consome a API.**

Há duas aplicações independentes. Escolha uma:

```powershell
npm.cmd --prefix .\frontend\Exercicio06-sync-assync\fetch-then-then-catch install
npm.cmd --prefix .\frontend\Exercicio06-sync-assync\fetch-then-then-catch run dev
```

Ou:

```powershell
npm.cmd --prefix .\frontend\Exercicio06-sync-assync\await-try-catch install
npm.cmd --prefix .\frontend\Exercicio06-sync-assync\await-try-catch run dev
```

**Fluxo:** abra **Listar Produtos** e acompanhe as mensagens no console do navegador para comparar a ordem das operações. Uma versão encadeia `.then()`/`.catch()`; a outra usa `async/await` e `try/catch`. **As duas fazem comunicação assíncrona**: `await` não transforma a requisição em uma operação síncrona que bloqueia todo o navegador.

O diretório pai do 06 não é um terceiro projeto npm. Para comparar as duas versões simultaneamente, use um terminal para cada frontend além do terminal da API.

### 07 — React Query e tratamento de erros

**Requer backend 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio07-react-query install
npm.cmd --prefix .\frontend\Exercicio07-react-query run dev
```

**Fluxo:** abra **Listar Produtos** e observe o carregamento e a recuperação da API por um hook com React Query. Falhas são encaminhadas ao tratamento de erro da aplicação. Testar com a API desligada exige reiniciá-la depois para voltar a consultar dados normalmente.

### 08 — página de produto

**Requer backend 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio08-produto install
npm.cmd --prefix .\frontend\Exercicio08-produto run dev
```

**Fluxo:** abra a listagem e clique no nome de um produto para acessar `/produtos/:id`. Confira imagem, categoria, nome, descrição, preço, estoque, data e disponibilidade. Os botões Editar e Remover desta etapa são ilustrativos; o fluxo completo de edição está nas atividades posteriores.

### 09 — pesquisa e paginação

**Requer backend 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio09-pesquisa_produto install
npm.cmd --prefix .\frontend\Exercicio09-pesquisa_produto run dev
```

**Fluxo:** abra **Listar Produtos**, escreva parte do nome, aguarde o debounce do Lodash e navegue pelas páginas. Os parâmetros `pagina`, `tamanho` e `nome` são enviados na query string; `keepPreviousData` mantém os dados anteriores durante a próxima consulta. A navegação não aparece quando há menos de duas páginas.

### 10 — remoção por mutation

**Requer backend 02. As remoções alteram o banco real.**

```powershell
npm.cmd --prefix .\frontend\Exercicio10-removendo_produto install
npm.cmd --prefix .\frontend\Exercicio10-removendo_produto run dev
```

**Fluxo:** localize um produto na tabela e clique em **Remover**. A mutation envia DELETE, exibe o estado de remoção e invalida as consultas de produtos. Se a remoção esvaziar a página, a navegação é ajustada para uma página válida.

### 11 — remoção otimista, sem paginação

**Requer backend 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio11-removendo_produto_otimista-incompleto install
npm.cmd --prefix .\frontend\Exercicio11-removendo_produto_otimista-incompleto run dev
```

**Fluxo:** remova um produto da listagem sem paginação. A interface o retira do cache antes da resposta final da API. O hook guarda os produtos anteriores e restaura esse estado caso a requisição falhe; ao concluir, revalida os dados com o servidor.

### 12 — remoção pelo ID e mensagem de confirmação

**Requer backend 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio12-removendo_produto_com_id install
npm.cmd --prefix .\frontend\Exercicio12-removendo_produto_com_id run dev
```

**Fluxo:** abra um produto pelos detalhes e clique em **Remover**. Ao concluir, a aplicação retorna à listagem e mostra uma caixa amarela com o nome do produto removido. A mensagem desaparece após quatro segundos. Também é possível pesquisar conforme se digita e remover pela tabela.

### 13 — estado compartilhado com Zustand

**Requer backend 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio13-zustand-incompleto install
npm.cmd --prefix .\frontend\Exercicio13-zustand-incompleto run dev
```

**Fluxo:** pesquise, mude de página, abra os detalhes e remova produtos. `ProdutoStore` compartilha página, nome pesquisado, tamanho da página e ID em remoção. Pesquisa, tabela e paginação consultam o estado necessário internamente, reduzindo a passagem de parâmetros. A aparência pode ser semelhante à anterior; a principal mudança é a organização do estado.

### 14 — nova API com login didático

**Atende os frontends 15 a 19b e requer banco.**

Inicie com o comando do backend 14 em [Execução em dois terminais](#execução-em-dois-terminais).

**Fluxo:** além das operações de produtos e categorias, oferece `POST /autenticacao/login` e cria as contas iniciais quando elas não existem. As tabelas e os dados são preservados no início normal, sem duplicar a carga a cada execução.

As requisições de exemplo estão em [testes.http](backend/Exercicio14-apirestfulv2/src/main/resources/testes.http). Para usá-las no VS Code, é necessário um cliente/extensão que execute arquivos HTTP, como REST Client; o arquivo não é um script PowerShell.

O login recebe `conta` e `senha` e retorna `token`, `idUsuario`, `nome` e `role`. Este backend **não implementa autorização real dos endpoints**; veja os limites em [Login e permissões](#login-e-permissões).

### 15 — Zustand com a nova API

**Requer backend 14, não o 02.**

```powershell
npm.cmd --prefix .\frontend\Exercicio15-zustand-com-nova-api install
npm.cmd --prefix .\frontend\Exercicio15-zustand-com-nova-api run dev
```

**Fluxo:** teste listagem, pesquisa, paginação, detalhes e remoção com a segunda versão da API. A tela de login ainda é ilustrativa nesta atividade; a integração de autenticação está no 16.

### 16 — login e rotas privadas

**Requer backend 14.**

```powershell
npm.cmd --prefix .\frontend\Exercicio16-login-parcialmente-completo install
npm.cmd --prefix .\frontend\Exercicio16-login-parcialmente-completo run dev
```

**Fluxo:** abra `/`, entre com uma das contas iniciais e compare os acessos do admin e do usuário comum. Saia de uma página, entre novamente e verifique o retorno para o caminho anterior. Também é possível testar uma URL privada antes do login.

O estado de autenticação fica no Zustand, as mensagens em `LoginStore` e o formulário usa React Hook Form. O cadastro e a edição de produto ainda não possuem o fluxo completo desta atividade.

### 17 — cadastro e alteração de produto

**Requer backend 14 e perfil ADMIN para gravar.**

```powershell
npm.cmd --prefix .\frontend\Exercicio17-cadastro-produto-parcialmente-completo install
npm.cmd --prefix .\frontend\Exercicio17-cadastro-produto-parcialmente-completo run dev
```

**Fluxo de cadastro:** entre como admin → **Cad. Produto** → preencha os oito campos → **Cadastrar**. Após sucesso, o formulário limpa os campos e exibe a confirmação.

**Fluxo de edição:** **Listar Produtos** → nome do produto → **Editar** → altere os campos → **Salvar alterações**. O formulário já vem preenchido e retorna aos detalhes após salvar.

`ProdutoForm` é compartilhado entre cadastro e alteração. `useCadastrarProduto` faz POST, `useAlterarProduto` faz PUT e ambos invalidam as consultas cujo início da chave é `["produtos"]`. O client é obtido com `useQueryClient`, sem import circular de `main.tsx`.

### 18 — edição e validação com Zod

**Requer backend 14 e perfil ADMIN para gravar.**

```powershell
npm.cmd --prefix .\frontend\Exercicio18-edicao-produtos-parcialmente-completo install
npm.cmd --prefix .\frontend\Exercicio18-edicao-produtos-parcialmente-completo run dev
```

**Fluxo:** abra um produto da carga inicial ou cadastrado por você → **Editar** → modifique qualquer um dos oito campos → **Salvar alterações**. O ID é preservado e identifica o registro a ser atualizado. As novas regras de validação também se aplicam ao cadastro.

Teste um nome somente numérico, data impossível, preço de 0,10 ou estoque fracionário: o formulário deve mostrar os erros sem enviar a alteração. Depois, corrija os dados e salve.

O schema está em [produtoSchema.ts](frontend/Exercicio18-edicao-produtos-parcialmente-completo/src/schemas/produtoSchema.ts). `zodResolver(schema)` integra Zod ao React Hook Form e `z.infer<typeof schema>` define o tipo do formulário. A validação de datas usa `dayjs` com `customParseFormat` em modo estrito.

### 19a — cadastro com validação no servidor

**Requer backend 14 e banco.** Partindo da raiz do repositório:

```powershell
cd .\frontend\Exercicio19a-cadastro-de-produto-sem-nenhuma-validacao
npm install
npm run dev
```

Se o terminal já estiver em `frontend\Exercicio19a-cadastro-de-produto-sem-nenhuma-validacao`, execute diretamente:

```powershell
npm install
npm run dev
```

O formulário envia os dados para validação na API. Consulte as [regras do exercício 19a](#validação-nos-exercícios-19a-e-19b).

### 19b — cadastro com validação no cliente

**Requer backend 14 e banco.** Em outro terminal na raiz do repositório, ou depois de encerrar o frontend anterior com `Ctrl+C`:

```powershell
cd .\frontend\Exercicio19b-cadastro-de-produto-com-validacao-no-cliente-em-andamento-incompleto
npm install
npm run dev
```

Nas execuções seguintes, dentro da mesma pasta, basta `npm run dev`. Abra a URL informada pelo Vite. O Zod valida os campos antes do envio; consulte as [regras do exercício 19b](#validação-nos-exercícios-19a-e-19b).

## Login e permissões

Regras dos frontends **16 a 18**, usando as contas iniciais do backend 14:

| Campo E-mail na tela | Senha inicial | Perfil |
| -------------------- | ------------- | ------ |
| `admin`              | `desweb`      | ADMIN  |
| `user`               | `desweb`      | USER   |

O campo visual é chamado **E-mail**, mas os valores iniciais são identificadores, não endereços de e-mail. `useEfetuarLogin` converte `email` para `conta` ao montar a requisição. As credenciais acima deixam de valer se forem alteradas no banco.

| Acesso                         | Visitante | Usuário comum | Admin |
| ------------------------------ | --------- | ------------- | ----- |
| Destino inicial `/`            | Login     | Home          | Home  |
| Home, carrinho e listagem      | Sim       | Sim           | Sim   |
| Favoritos e `/produtos/:id`    | Não       | Sim           | Sim   |
| Cadastro de produto            | Não       | Não           | Sim   |
| Edição, nos exercícios 17 e 18 | Não       | Não           | Sim   |
| Botões de editar/remover       | Não       | Não           | Sim   |

- `PrivateRoutes` usa `Outlet` e `children` para separar rotas autenticadas e rotas com `apenasAdmin`.
- Visitantes que tentam uma página privada vão ao login; usuários comuns tentando uma página de admin vão à home.
- O caminho anterior, incluindo query string e fragmento, fica em `location.state.from`. Após entrar, `<Navigate />` retorna a esse caminho, respeitando as permissões. Sem origem válida, o destino é `/home`.
- Ao clicar em **Sair**, a navbar limpa token e mensagens e guarda o caminho atual para permitir o retorno no próximo login.
- `TokenStore` guarda a resposta do login e `LoginStore` guarda a mensagem. A senha não é armazenada nesses stores.
- O estado é somente em memória: atualizar a página exige novo login.
- **Esqueceu a senha?** e **Cadastre-se** são links ilustrativos, sem recuperação de senha ou cadastro de usuários implementados.

**Limite de segurança:** `token` é apenas o ID convertido em texto, não um JWT nem uma sessão autenticada. O nome de exibição usa a conta; o backend atribui ADMIN a `admin` e USER às demais contas autenticadas. Ocultar botões, proteger rotas e conferir o store antes de uma mutation não impede chamadas diretas à API. É necessário implementar autenticação/autorização no servidor antes de usar esta aplicação fora de um ambiente didático.

## Cadastro, edição e imagens

Nos exercícios 17 e 18, o formulário contém nome, descrição, categoria, estoque, data de cadastro, preço, imagem e disponibilidade.

- `categoria` é o número da opção escolhida. As opções fixas seguem a carga inicial: **1 = Fruta, 2 = Legume, 3 = Verdura**.
- `qtd_estoque`, `data_cadastro` e `preco` ficam como texto no formulário.
- `converterProdutoForm` produz `categoria: { id }`, `qtdEstoque` e `preco` numéricos e `dataCadastro` em `YYYY-MM-DD`.
- No POST, o banco gera o ID. No PUT, o ID original é mantido, sem distinção entre produtos iniciais e produtos criados pela interface.
- Enquanto salva, os campos ficam desabilitados. Falhas preservam os dados para nova tentativa; o cadastro só limpa o formulário depois de sucesso.
- Não há cadastro de categorias nem upload de imagens.

### Regras do exercício 18

| Campo      | Validação                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Nome       | Obrigatório, mínimo de três caracteres e ao menos uma letra; aceita texto com números e letras acentuadas |
| Descrição  | Texto obrigatório                                                                                         |
| Categoria  | Número inteiro entre as opções 1, 2 e 3; não aceita 0                                                     |
| Data       | Data real em formato estrito `YYYY-MM-DD`; rejeita dias impossíveis                                       |
| Preço      | Decimal finito com até duas casas e **maior que 0,10**                                                    |
| Estoque    | Inteiro de 0 até 2147483647, compatível com o tipo Java `int`                                             |
| Imagem     | Letras minúsculas sem acentos, seguidas de `.gif`, `.jpg`, `.png` ou `.bmp`                               |
| Disponível | Booleano do checkbox                                                                                      |

Nome, descrição e imagem têm limite de 255 caracteres. O formulário usa `noValidate` para exibir as mensagens do Zod, em vez dos avisos nativos do navegador. `isCategoriaValida` e `isDataValida` implementam as verificações do roteiro; a função de data mantém logs demonstrativos no console.

Exemplos: `Produto 18` é um nome válido; `12345` não. `abacate.png` é válido; `Abacate.png`, `abacate1.png` e `foto.jpeg` não passam na regex solicitada.

### Validação nos exercícios 19a e 19b

Os dois usam a API do exercício 14. Os comandos completos estão nas seções [19a](#19a--cadastro-com-validação-no-servidor) e [19b](#19b--cadastro-com-validação-no-cliente). Execute `npm run dev` na pasta do exercício, que contém o `package.json`.

- **19a — validação no servidor:** o formulário envia os dados, inclusive campos vazios, e a API devolve HTTP 400 com as mensagens por campo. A página de erro exibe o JSON da resposta. O POST exige ID ausente ou nulo; o PUT exige ID informado. A API aceita preço a partir de 0,10 e estoque a partir de zero.
- **19b — validação no cliente e no servidor:** o Zod exibe os erros abaixo dos campos e impede o envio até que o formulário seja válido. O cliente exige nome com no mínimo três caracteres, data válida, preço **maior que 0,10** e nome de imagem com letras minúsculas e uma extensão do roteiro. Se o servidor rejeitar uma requisição que passou pelo formulário, a página de erro continua disponível.

### Onde colocar a imagem

Copie o arquivo para `public/` **do frontend escolhido** e informe somente seu nome e extensão no formulário.

Por exemplo, no exercício 18:

```text
frontend/Exercicio18-edicao-produtos-parcialmente-completo/public/abacate.png
```

No campo Imagem, digite `abacate.png`. O banco guarda esse nome, não os bytes da imagem. Se o arquivo não existir no frontend em execução, a imagem ficará quebrada. O servidor da API não envia automaticamente os arquivos estáticos de outro exercício.

## Banco e carga inicial

As configurações ficam em:

- [persistence.xml do exercício 01](backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/src/main/resources/META-INF/persistence.xml);
- [application.properties do backend 02](backend/Exercicio02-apirestful/src/main/resources/application.properties);
- [application.properties do backend 14](backend/Exercicio14-apirestfulv2/src/main/resources/application.properties).

Para tentar UFF primeiro e localhost como fallback, use os comandos normais de início **sem** o argumento que força `spring.datasource.url`. Não é necessário alterar o código Java para escolher essa configuração.

As APIs usam `spring.jpa.hibernate.ddl-auto=update`, preservando os dados entre execuções. O backend 02 interrompe a carga inicial quando já há produtos; o 14 evita recriar as contas e não repete a carga de categorias/produtos se já houver dados. Por isso, **reiniciar a API normalmente não reinserirá cada produto removido**.

Os backends 02 e 14 compartilham `desweb`. Uma remoção feita em um frontend pode aparecer nos outros. O exercício 01 usa um modelo diferente de produto, com lance mínimo e data de venda: não misture seu script SQL com as tabelas das APIs.

### Reinserir a carga inicial — operação destrutiva

Se precisar recomeçar a atividade e puder perder os dados atuais, pare a API, faça backup do que precisar preservar e execute explicitamente o backend escolhido com `create`. Exemplo para o 14:

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -f .\backend\Exercicio14-apirestfulv2\pom.xml spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb --spring.jpa.hibernate.ddl-auto=create"
```

**Isso apaga e recria as tabelas das entidades dessa API. Não use para uma inicialização normal nem contra um banco compartilhado da UFF.** Para o 02, selecione seu POM com `-f .\backend\Exercicio02-apirestful\pom.xml`. Após terminar a reinserção, pare a API e volte ao comando normal com `update`.

## Testes e compilação

### Java

O [POM da raiz](pom.xml) agrega os três projetos de `backend/`. Para compilar e testar todos sem iniciar as APIs de uso:

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd test
```

O exercício 01 exige a biblioteca `corejava:console` mencionada anteriormente. Se ainda não a tiver, valide apenas o backend desejado, por exemplo:

```powershell
.\backend\Exercicio14-apirestfulv2\mvnw.cmd -f .\backend\Exercicio14-apirestfulv2\pom.xml test
```

Os testes das APIs usam **H2 em memória**, sem modificar o MySQL. O backend 14 cobre login, mappers, paginação e cadastro/edição por HTTP de produtos novos e da carga inicial. Os servidores HTTP de teste usam portas temporárias; não substituem a API que deve ficar na porta 8080 para executar os frontends.

### React

Escolha a pasta de qualquer frontend e execute build e lint. Exemplo com o 18, ainda a partir da raiz:

```powershell
npm.cmd --prefix .\frontend\Exercicio18-edicao-produtos-parcialmente-completo run build
npm.cmd --prefix .\frontend\Exercicio18-edicao-produtos-parcialmente-completo run lint
```

Os exercícios 17 e 18 também possuem testes automatizados:

```powershell
npm.cmd --prefix .\frontend\Exercicio17-cadastro-produto-parcialmente-completo test
npm.cmd --prefix .\frontend\Exercicio18-edicao-produtos-parcialmente-completo test
```

Os testes do frontend usam requisições e hooks simulados para conferir formulário, conversão, mutations, cache e rotas. No 18, o schema e o resolver Zod são executados de verdade. Esses testes não substituem a inspeção das telas no navegador nem a execução conjunta frontend/API.

`npm run lint` usa Oxlint nos projetos iniciais 03 a 05 e ESLint nos demais. Não há um script de validação em `scripts/` no estado atual do repositório; use os comandos existentes acima.

## Mappers e organização do código

Os arquivos `ProdutoMapperImpl.java` e `CategoriaMapperImpl.java` dos backends 02 e 14 são gerados pelo MapStruct. Edite as interfaces em `src/main/java`, não os arquivos de `target`.

| Compilador               | Classes              | Mappers gerados                            |
| ------------------------ | -------------------- | ------------------------------------------ |
| Maven no terminal        | `target/classes`     | `target/generated-sources/annotations`     |
| VS Code/Eclipse, via m2e | `target/ide-classes` | `target/generated-sources/ide-annotations` |

A separação evita que os compiladores sobrescrevam o mesmo mapper simultaneamente. O processamento inclui `lombok-mapstruct-binding` para integrar Lombok e MapStruct.

Se o VS Code mantiver erros antigos, execute **Java: Clean Java Language Server Workspace** e permita reimportar o projeto Maven. Depois de mover ou renomear pastas, reabra os terminais nos caminhos atuais.

`target/`, `node_modules/` e `dist/` são gerados localmente e não são versionados. Dependências e saídas de build não devem ser copiadas para dentro de `src/`.

## Problemas comuns

| Sintoma                                                 | O que conferir                                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `mvn` não é reconhecido ou `MAVEN_HOME` está vazio      | Use o `mvnw.cmd` incluído, com Java 25 instalado                                                     |
| `JAVA_HOME` inválido ou erro de compilação `release 25` | Verifique `java -version`, `JAVA_HOME` e qual JDK o terminal selecionou                              |
| `Missing artifact corejava:console:jar:1.0`             | Instale localmente a biblioteca do exercício 01 fornecida pelo professor                             |
| `npm.ps1 cannot be loaded`                              | Use `npm.cmd`, como nos exemplos                                                                     |
| `ENOENT ... package.json`                               | Confira o caminho; no 06, selecione uma das duas subpastas                                           |
| `Port 8080 was already in use`                          | Pare a API anterior; não inicie 02 e 14 juntos                                                       |
| Erro de conexão com MySQL                               | Ligue o banco e confira porta, existência de `desweb`, usuário e senha                               |
| A conexão com a UFF demora ou falha                     | Fora da universidade, force localhost com o argumento dos comandos rápidos                           |
| Interface mostra erro ao buscar produtos                | Confira se o backend correspondente está iniciado e responde em `/produtos`                          |
| Login recebe resposta incompatível                      | Confirme que está usando o backend 14 atualizado, não o 02                                           |
| Login inválido                                          | Use as credenciais cadastradas; os valores iniciais são `admin`/`desweb` e `user`/`desweb`           |
| Produto não aparece após uma busca                      | Limpe o filtro e confira a página selecionada; produtos removidos não reaparecem apenas ao reiniciar |
| Imagem quebrada                                         | Confira o arquivo em `public/` da atividade em execução e o nome salvo no produto                    |
| Nome de imagem rejeitado no 18                          | Confira a regex: letras minúsculas e uma das quatro extensões permitidas                             |
| Erros nos `MapperImpl`                                  | Reimporte o Maven e gere novamente pelo build; não corrija o arquivo gerado manualmente              |
| Build do 18 alerta sobre pacote JavaScript grande       | É um aviso de tamanho, não uma falha de compilação; não equivale a um erro de formulário             |

Não execute `npm audit fix --force` indiscriminadamente: atualizações incompatíveis podem alterar o ambiente dos exercícios. Alertas de dependência devem ser analisados antes de publicar a aplicação.

## Conceitos e documentação de apoio

As anotações de persistência e log que acompanhavam o exercício 01 foram reunidas aqui:

- **JPA — Java Persistence API:** especificação para mapear entidades Java e operações de persistência.
- **ORM — mapeamento objeto-relacional:** relação entre objetos do modelo e tabelas do banco.
- **Hibernate:** implementação de persistência/ORM utilizada nos projetos.
- **Spring Data JPA:** abstração de repositórios sobre JPA; não é, por si só, uma implementação de JPA.
- **SLF4J:** fachada de logging que separa a API de log da implementação utilizada. O exercício 01 atual usa `slf4j-simple` e [simplelogger.properties](backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/src/main/resources/simplelogger.properties). As antigas anotações sobre Log4j eram exemplos, não o arquivo de configuração ativo desse projeto.

Documentação de apoio para os conceitos e ferramentas usados nas atividades:

- [Maven Wrapper](https://maven.apache.org/wrapper/) e [integração de Lombok com MapStruct](https://mapstruct.org/faq/#Can-I-use-MapStruct-together-with-Project-Lombok).
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/) e [SLF4J](https://www.slf4j.org/manual.html).
- [React](https://react.dev/), [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/) e [React Compiler](https://react.dev/learn/react-compiler/installation).
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview), [Zustand](https://zustand.docs.pmnd.rs/), [React Hook Form](https://react-hook-form.com/) e [Zod](https://zod.dev/).
- [ESLint com TypeScript](https://typescript-eslint.io/getting-started/typed-linting/), [regras do Oxlint](https://oxc.rs/docs/guide/usage/linter/rules), [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) e [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom).
- [Plugin React do Vite](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react), [alternativa SWC](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc), [Oxc](https://oxc.rs) e [SWC](https://swc.rs/).

As sugestões de configuração dos READMEs originais do template eram opcionais; a configuração efetiva está em cada projeto. Não é necessário trocar o linter ou habilitar React Compiler para executar os exercícios.

## Licença

O repositório utiliza a [licença MIT](LICENSE).

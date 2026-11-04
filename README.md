# Exercícios de Desenvolvimento Web — UFF

Projetos da disciplina organizados em `backend/` (Java) e `frontend/` (React). Os números originais foram preservados para manter a correspondência com as atividades do professor.

## Organização e evolução das APIs

```text
Dev-Web-UFF/
├── backend/
│   ├── Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/
│   ├── Exercicio02-apirestful/
│   └── Exercicio14-apirestfulv2/
├── frontend/
│   ├── Exercicio03-react/
│   ├── ...
│   ├── Exercicio15-zustand-com-nova-api/
│   └── Exercicio16-login-parcialmente-completo/
└── pom.xml
```

| Frontend | Backend que deve estar rodando | O que muda |
| --- | --- | --- |
| Exercícios 03 a 05 | Nenhum | Interface e produtos locais |
| Exercícios 06 a 13 | [Exercício 02](backend/Exercicio02-apirestful/) | **O consumo da primeira API começa no frontend 06** |
| Exercícios 15 e 16 | [Exercício 14](backend/Exercicio14-apirestfulv2/) | **A troca de backend começa no frontend 15**; o 16 acrescenta o login |

Os exercícios 02 e 14 são os números das atividades em que os backends foram criados, não dos únicos frontends que podem usá-los. O 14 não tem um frontend próprio neste repositório.

O [Exercício 01](backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/) fica junto dos projetos Java, mas é uma aplicação de console que acessa o banco diretamente: **não é um servidor HTTP e não deve ser iniciado para servir os frontends**.

## Pré-requisitos

- Java 25 e Maven disponível em `MAVEN_HOME` ou no `PATH`.
- Node.js e npm compatíveis com a versão de Vite de cada projeto. Para usar todos os projetos recentes, prefira o Node 22.12 ou superior já instalado no ambiente.
- MySQL/MariaDB ligado na porta 3306 e banco `desweb` existente.

Confira o ambiente:

```powershell
java -version
& "$env:MAVEN_HOME\bin\mvn.cmd" -version
node -v
npm -v
```

Os comandos abaixo usam PowerShell e caminhos completos, portanto não dependem da pasta em que o terminal foi aberto. Se o repositório estiver em outro local, ajuste o prefixo `D:\Documents\GitHub\Dev-Web-UFF`.

## Rodar o exercício 16 em dois terminais

### Terminal 1 — backend do exercício 14

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\backend\Exercicio14-apirestfulv2
& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run
```

Aguarde aparecer `Started ApirestfulApplication`. A API estará em `http://localhost:8080`. Mantenha esse terminal aberto.

### Terminal 2 — frontend do exercício 16

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\frontend\Exercicio16-login-parcialmente-completo
npm install
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. O `npm install` é necessário na primeira execução e quando as dependências mudarem.

O proxy do Vite encaminha `/api` para a API na porta 8080. Para testar o login, acesse `/login`. A carga inicial do backend cria as contas didáticas `admin` e `user`, ambas com senha `desweb`, caso elas ainda não existam.

O login do 16 segue o roteiro com React Hook Form, `useEfetuarLogin`, `TokenStore` e `LoginStore`. O backend retorna `token`, `idUsuario`, `nome` e `role`. A conta autenticada `admin` recebe `ADMIN`; as demais recebem `USER`. Na entrada `/`, usuários logados vão para `/home` e visitantes para `/login`. As páginas comuns continuam públicas. `PrivateRoutes` permite favoritos e detalhes de produto a qualquer logado, mas reserva o cadastro de produto ao admin. Os botões Editar e Remover também aparecem somente para o admin. Visitantes que tentam abrir páginas privadas vão ao login; usuários comuns tentando cadastrar vão à home. O token ainda é didático (ID convertido para texto) e o nome usa a conta. Não há JWT nem autorização dos endpoints no servidor: essa restrição protege apenas a navegação e as ações da interface. Os stores são somente em memória; recarregar a página exige novo login. Cadastro e recuperação de senha são links ilustrativos.

Para usar o frontend 15, mantenha esse mesmo backend e troque apenas a pasta do terminal 2:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\frontend\Exercicio15-zustand-com-nova-api
npm install
npm run dev
```

## Rodar os frontends 06 a 13 em dois terminais

### Terminal 1 — backend do exercício 02

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\backend\Exercicio02-apirestful
& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run
```

### Terminal 2 — frontend escolhido

Exemplo com o exercício 09:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\frontend\Exercicio09-pesquisa_produto
npm install
npm run dev
```

Para outro exercício, use a pasta correspondente na tabela abaixo. Não é necessário modificar imports nem o proxy para alternar entre as versões corretas.

**Execute apenas um backend por vez:** os exercícios 02 e 14 usam a mesma porta 8080. Pare o anterior com `Ctrl+C` antes de trocar. Para encerrar o frontend, pressione `Ctrl+C` no outro terminal.

## Pastas de cada frontend

Depois de entrar na pasta escolhida, execute `npm install` e `npm run dev`.

| Exercício | Pasta relativa à raiz | Dependência |
| --- | --- | --- |
| 03 — introdução ao React | `frontend/Exercicio03-react` | Nenhuma API |
| 04 — navbar e rotas | `frontend/Exercicio04-navbar` | Nenhuma API |
| 05 — produtos locais | `frontend/Exercicio05-produtos` | Nenhuma API |
| 06 — async/await e try/catch | `frontend/Exercicio06-sync-assync/await-try-catch` | Backend 02 |
| 06 — then/catch | `frontend/Exercicio06-sync-assync/fetch-then-then-catch` | Backend 02 |
| 07 — React Query | `frontend/Exercicio07-react-query` | Backend 02 |
| 08 — página de produto | `frontend/Exercicio08-produto` | Backend 02 |
| 09 — pesquisa e paginação | `frontend/Exercicio09-pesquisa_produto` | Backend 02 |
| 10 — remoção de produto | `frontend/Exercicio10-removendo_produto` | Backend 02 |
| 11 — remoção otimista sem paginação | `frontend/Exercicio11-removendo_produto_otimista-incompleto` | Backend 02 |
| 12 — remoção pela página de produto | `frontend/Exercicio12-removendo_produto_com_id` | Backend 02 |
| 13 — estado compartilhado | `frontend/Exercicio13-zustand-incompleto` | Backend 02 |
| 15 — Zustand com a nova API | `frontend/Exercicio15-zustand-com-nova-api` | Backend 14 |
| 16 — login parcialmente completo | `frontend/Exercicio16-login-parcialmente-completo` | Backend 14 |

Os exercícios 03 a 05 precisam somente do terminal do frontend. No 06, execute uma das duas subpastas; o diretório pai contém apenas a organização das versões.

## Banco de dados

Ligue o banco pelo gerenciador usado na máquina, por exemplo o painel do XAMPP. Se o banco `desweb` ainda não existir, crie-o com:

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS desweb CHARACTER SET utf8mb4;"
```

Se o root local não tiver senha, retire `-p`. Se `mysql` não estiver no PATH, use o caminho do executável instalado.

Os backends 02 e 14 tentam acessar primeiro o servidor da UFF e usam localhost como fallback. Para forçar somente o local, execute o comando abaixo **dentro da pasta do backend escolhido**:

```powershell
& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb"
```

As APIs usam `spring.jpa.hibernate.ddl-auto=update`, preservando os dados entre execuções. Como compartilham o banco `desweb`, as remoções feitas nos frontends também alteram os dados vistos pelas outras atividades.

Para **apagar e recriar as tabelas e a carga inicial**, pare a API e execute explicitamente, na pasta do backend escolhido:

```powershell
& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb --spring.jpa.hibernate.ddl-auto=create"
```

Esse comando é destrutivo: não use para uma inicialização normal.

## Exercício 01 — Java/JPA no console

Não depende de nenhuma API e precisa somente do banco e de um terminal. Se necessário, prepare as tabelas com o script `backend/Exercicio01-Produto-Inclui-Altera-Exclui-incompleto/script/Tabelas.sql`, depois execute:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\backend\Exercicio01-Produto-Inclui-Altera-Exclui-incompleto
& "$env:MAVEN_HOME\bin\mvn.cmd" compile exec:java "-Dexec.mainClass=com.carlosribeiro.Principal"
```

Use o menu do terminal para cadastrar, alterar, remover ou listar produtos.

**Atenção:** o exercício 01 usa um modelo diferente da tabela `produto`. Não aplique seu SQL ao mesmo banco que contém os dados das APIs sem antes separá-los ou fazer backup.

## Validação e mappers gerados

O `pom.xml` da raiz agrega os três projetos de `backend/`. Os testes das APIs 02 e 14 usam H2 em memória e não alteram o MySQL.

A partir da raiz:

```powershell
.\scripts\verificar-exercicios.ps1
```

Para validar só uma parte:

```powershell
.\scripts\verificar-exercicios.ps1 -SomenteJava
.\scripts\verificar-exercicios.ps1 -SomenteFrontend
```

Também é possível executar os testes Java manualmente:

```powershell
& "$env:MAVEN_HOME\bin\mvn.cmd" test
```

Em cada frontend, os comandos de validação são `npm run build` e `npm run lint`. O script usa as dependências já instaladas; não instala pacotes nem inicia servidores.

Os `MapperImpl.java` dos backends 02 e 14 são gerados pelo MapStruct. Altere os arquivos de `src/main/java`, nunca os de `target`.

| Compilador | Classes | Mappers gerados |
| --- | --- | --- |
| Maven no terminal | `target/classes` | `target/generated-sources/annotations` |
| VS Code/Eclipse (m2e) | `target/ide-classes` | `target/generated-sources/ide-annotations` |

A separação evita sobrescritas entre a IDE e o Maven. O processamento de Lombok inclui `lombok-mapstruct-binding`, como orienta a [documentação do MapStruct](https://mapstruct.org/faq/#Can-I-use-MapStruct-together-with-Project-Lombok).

Após mover as pastas, feche terminais abertos nos caminhos antigos e, se o VS Code mantiver erros de Java, execute **Java: Clean Java Language Server Workspace** na paleta de comandos. Classes, dependências, imagens e arquivos de configuração permanecem dentro de seus respectivos projetos. `target`, `node_modules` e `dist` não são versionados.

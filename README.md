# Exercícios de Desenvolvimento Web — UFF

Este repositório reúne os exercícios Java, Spring Boot e React desenvolvidos durante a disciplina. Os comandos abaixo consideram o PowerShell aberto na raiz do repositório:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF
```

## Pré-requisitos

- Java 25;
- Maven configurado na variável `MAVEN_HOME`;
- Node.js 20.19 ou superior;
- npm;
- MySQL ou MariaDB na porta `3306` para os exercícios 01 e 02.

Para conferir as instalações:

```powershell
java -version
& "$env:MAVEN_HOME\bin\mvn.cmd" -version
node -v
npm -v
```

Nos projetos React, execute `npm install` uma vez antes de usar `npm run dev`. O endereço normalmente será `http://localhost:5173`; caso a porta esteja ocupada, o Vite informará outra porta no terminal.

## Dependências entre os exercícios

| Exercício | Tipo | Pode ser executado sozinho? | Dependência |
| --- | --- | --- | --- |
| 01 | Java/JPA no console | Não | MySQL e banco `desweb` |
| 02 | API REST com Spring Boot | Não | MySQL e banco `desweb` |
| 03 | React | Sim | Nenhuma API |
| 04 | React, rotas e navbar | Sim | Nenhuma API |
| 05 | React com produtos locais | Sim | Nenhuma API |
| 06 | Duas versões React com `fetch` | Não | Exercício 02 em execução |
| 07 | React Query | Não | Exercício 02 em execução |
| 08 | Página de produto | Não | Exercício 02 em execução |
| 09 | Pesquisa e paginação | Não | Exercício 02 em execução |
| 10 | Remoção de produto | Não | Exercício 02 em execução |

## Preparação do MySQL

Inicie o MySQL pelo painel do XAMPP ou pelo gerenciador usado na máquina. Depois, crie o banco caso ele ainda não exista:

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS desweb CHARACTER SET utf8mb4;"
```

Se o usuário `root` local não tiver senha, remova `-p` do comando. As configurações dos exercícios 01 e 02 tentam acessar primeiro o servidor da UFF e usam o servidor local como alternativa.

## Exercício 01 — aplicação Java/JPA no console

Esse exercício acessa o MySQL diretamente e não utiliza o Exercício 02. Antes da primeira execução, carregue a estrutura e os dados iniciais:

```powershell
Get-Content -Raw .\Exercicio01-Produto-Inclui-Altera-Exclui-incompleto\script\Tabelas.sql | mysql -u root -p
```

Em seguida, compile e execute a classe principal:

```powershell
cd .\Exercicio01-Produto-Inclui-Altera-Exclui-incompleto
& "$env:MAVEN_HOME\bin\mvn.cmd" compile exec:java "-Dexec.mainClass=com.carlosribeiro.Principal"
```

Use as opções exibidas no terminal para cadastrar, alterar, remover ou listar produtos.

## Exercício 02 — API RESTful

O MySQL precisa estar ativo e o banco `desweb` precisa existir. Para executar usando a configuração padrão:

```powershell
cd .\Exercicio02-apirestful
& "$env:MAVEN_HOME\bin\mvn.cmd" clean spring-boot:run
```

A configuração padrão usa `spring.jpa.hibernate.ddl-auto=create`: as tabelas são recriadas e os dados anteriores são apagados sempre que a aplicação inicia. Para forçar o MySQL local e preservar os dados entre execuções, use:

```powershell
& "$env:MAVEN_HOME\bin\mvn.cmd" clean spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb --spring.jpa.hibernate.ddl-auto=update"
```

Quando aparecer a mensagem `Started ApirestfulApplication`, a API estará disponível em `http://localhost:8080`. Mantenha esse terminal aberto ao executar os exercícios 06 a 10.

## Exercício 03 — introdução ao React

Executa de forma independente:

```powershell
cd .\Exercicio03-react
npm install
npm run dev
```

## Exercício 04 — navbar e rotas

Executa de forma independente:

```powershell
cd .\Exercicio04-navbar
npm install
npm run dev
```

## Exercício 05 — lista local de produtos

Executa de forma independente porque os produtos estão definidos no próprio frontend:

```powershell
cd .\Exercicio05-produtos
npm install
npm run dev
```

## Exercício 06 — `fetch` com duas formas de tratamento

Primeiro, mantenha o Exercício 02 em execução. O Exercício 06 possui dois projetos React separados; execute apenas a versão que deseja testar.

Versão com `.then()` e `.catch()`:

```powershell
cd .\Exercicio06-sync-assync\fetch-then-then-catch
npm install
npm run dev
```

Versão com `async/await` e `try/catch`:

```powershell
cd .\Exercicio06-sync-assync\await-try-catch
npm install
npm run dev
```

Se quiser comparar as duas versões simultaneamente, abra cada projeto em um terminal. O segundo Vite escolherá outra porta automaticamente.

## Exercício 07 — React Query

Requer o Exercício 02 em execução:

```powershell
cd .\Exercicio07-react-query
npm install
npm run dev
```

## Exercício 08 — página de produto

Requer o Exercício 02 em execução:

```powershell
cd .\Exercicio08-produto
npm install
npm run dev
```

## Exercício 09 — pesquisa e paginação

Requer o Exercício 02 em execução:

```powershell
cd .\Exercicio09-pesquisa_produto
npm install
npm run dev
```

## Exercício 10 — remoção de produto

Requer o Exercício 02 em execução:

```powershell
cd .\Exercicio10-removendo_produto
npm install
npm run dev
```

O botão **Remover** envia uma requisição `DELETE` para a API. Portanto, o MySQL, o Exercício 02 e o Exercício 10 precisam permanecer ativos durante o teste.

## Como executar frontend e backend juntos

Para os exercícios 06 a 10, use dois terminais.

Terminal 1 — banco e API:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\Exercicio02-apirestful
& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:mysql://localhost:3306/desweb --spring.jpa.hibernate.ddl-auto=update"
```

Terminal 2 — frontend escolhido, por exemplo o Exercício 10:

```powershell
cd D:\Documents\GitHub\Dev-Web-UFF\Exercicio10-removendo_produto
npm run dev
```

O Vite encaminha as chamadas iniciadas por `/api` para `http://localhost:8080`. Se a API não estiver ativa, as páginas que recuperam produtos apresentarão erro de conexão.

Para encerrar qualquer aplicação iniciada no terminal, pressione `Ctrl+C`.

## Comandos de validação

Para validar um projeto React sem iniciar o servidor de desenvolvimento:

```powershell
npm run build
npm run lint
```

Para validar os projetos Maven:

```powershell
& "$env:MAVEN_HOME\bin\mvn.cmd" clean compile
```

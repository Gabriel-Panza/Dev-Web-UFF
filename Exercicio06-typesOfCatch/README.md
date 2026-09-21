# Exercício 06 — tratamento de requisições

As duas aplicações React mostram os produtos da API do `Exercicio02-apirestful`:

- `fetch-then-then-catch`: usa `.then()` e `.catch()`.
- `await-try-catch`: usa `async/await` e `try/catch`.

## Executar

1. Inicie o MySQL/MariaDB local, caso ainda não esteja ativo. A API já está configurada para tentar o servidor da UFF e, se indisponível, usar `localhost:3306/desweb`.
2. Estando em `Exercicio06-typesOfCatch`, inicie a API em um terminal:

   ```powershell
   cd ..\Exercicio02-apirestful
   mvn spring-boot:run "-Dspring-boot.run.arguments=--spring.jpa.hibernate.ddl-auto=update"
   ```

   O parâmetro `update` evita que a configuração padrão `create` recrie as tabelas e apague os dados durante o teste. A API deve responder em `http://localhost:8080/produtos`.

3. Em outro terminal aberto em `Exercicio06-typesOfCatch`, escolha uma versão:

   ```powershell
   cd .\fetch-then-then-catch
   npm run dev
   ```

   Ou:

   ```powershell
   cd .\await-try-catch
   npm run dev
   ```

   Abra o endereço mostrado pelo Vite e acesse **Listar Produtos**. Se executar as duas ao mesmo tempo, abra cada uma em seu próprio terminal; o Vite atribuirá outra porta à segunda aplicação.

No desenvolvimento, o Vite encaminha `/api/produtos` para `http://localhost:8080/produtos`. Assim, as duas versões usam a mesma API sem precisar alterar o CORS do backend. Em uma publicação fora do Vite, é necessário configurar um proxy equivalente.

package com.carlosribeiro.apirestful;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.datasource.url=jdbc:h2:mem:exercicio20;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "api.security.token.secret=chave-exclusiva-dos-testes-do-exercicio20"
})
class ApirestfulApplicationTests {

    @LocalServerPort
    private int porta;

    @Autowired
    private ApirestfulApplication aplicacao;

    private final HttpClient http = HttpClient.newHttpClient();
    private final JsonMapper json = new JsonMapper();

    @Test
    void protegeEscritaDeProdutosEAplicaOsPerfisDoJwt() throws Exception {
        assertThat(requisicao("GET", "/produtos/paginacao", null, null).statusCode()).isEqualTo(200);
        assertThat(requisicao("GET", "/usuarios", null, null).body()).doesNotContain("\"senha\"");

        String produto = """
            {
              "nome": "Abacaxi", "descricao": "1 unidade", "imagem": "abacaxi.png",
              "disponivel": true, "qtdEstoque": 10, "preco": 2.45,
              "dataCadastro": "2025-04-26", "categoria": {"id": 1}
            }
            """;
        assertThat(requisicao("POST", "/produtos", produto, null).statusCode()).isEqualTo(401);
        assertThat(requisicao("POST", "/produtos", produto, "token-invalido").statusCode()).isEqualTo(401);

        String user = login("user@mail.com", "USER");
        String admin = login("admin@mail.com", "ADMIN");
        assertThat(requisicao("POST", "/produtos", "{}", user).statusCode()).isEqualTo(400);
        var cadastro = requisicao("POST", "/produtos", produto, user);
        assertThat(cadastro.statusCode()).isEqualTo(200);
        long id = json.readTree(cadastro.body()).path("id").asLong();
        assertThat(id).isPositive();

        String detalhe = "/produtos/" + id;
        String alteracao = json.readValue(produto, ObjectNode.class)
            .put("id", id)
            .put("nome", "Abacaxi maduro")
            .toString();
        assertThat(requisicao("PUT", "/produtos", alteracao, user).statusCode()).isEqualTo(403);
        assertThat(requisicao("DELETE", detalhe, null, user).statusCode()).isEqualTo(403);
        assertThat(requisicao("PUT", "/produtos", alteracao, admin).statusCode()).isEqualTo(200);

        int quantidade = json.readTree(requisicao("GET", "/produtos", null, null).body()).size();
        aplicacao.run();
        assertThat(json.readTree(requisicao("GET", "/produtos", null, null).body()).size()).isEqualTo(quantidade);
        assertThat(requisicao("GET", detalhe, null, null).body()).contains("Abacaxi maduro");
        assertThat(requisicao("DELETE", detalhe, null, admin).statusCode()).isEqualTo(200);
        assertThat(requisicao("GET", detalhe, null, null).statusCode()).isEqualTo(404);
    }

    private String login(String email, String role) throws Exception {
        String dados = """
            {"email":"%s","senha":"desweb"}
            """.formatted(email);
        var resposta = requisicao("POST", "/autenticacao/login", dados, null);
        assertThat(resposta.statusCode()).isEqualTo(200);
        var corpo = json.readTree(resposta.body());
        assertThat(corpo.path("role").asText()).isEqualTo(role);
        String token = corpo.path("token").asText();
        assertThat(token).isNotBlank();
        return token;
    }

    private HttpResponse<String> requisicao(String metodo, String caminho, String corpo, String token)
        throws IOException, InterruptedException {
        var request = HttpRequest.newBuilder(URI.create("http://localhost:" + porta + caminho));
        if (token != null) {
            request.header("Authorization", "Bearer " + token);
        }
        if (corpo == null) {
            request.method(metodo, HttpRequest.BodyPublishers.noBody());
        } else {
            request.header("Content-Type", "application/json");
            request.method(metodo, HttpRequest.BodyPublishers.ofString(corpo));
        }
        return http.send(request.build(), HttpResponse.BodyHandlers.ofString());
    }

}

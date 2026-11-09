package com.carloribeiro.apirestful;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.carloribeiro.apirestful.repository.CategoriaRepository;
import com.carloribeiro.apirestful.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import tools.jackson.databind.json.JsonMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = "spring.datasource.url=jdbc:h2:mem:cadastro17;MODE=MySQL;DB_CLOSE_DELAY=-1")
class ProdutoCadastroHttpTest {
    @Value("${local.server.port}") private int port;
    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private CategoriaRepository categoriaRepository;

    @Test
    void deveCadastrarAlterarERecuperarProdutoComOPayloadDoFormulario() throws Exception {
        long quantidadeAntes = produtoRepository.count();
        long categoriaId = categoriaRepository.findAll().getFirst().getId();
        String dados = "\"nome\":\"Produto teste 17\",\"descricao\":\"1 unidade\","
            + "\"imagem\":\"abacate.png\",\"categoria\":{\"id\":" + categoriaId + "},"
            + "\"preco\":2.45,\"qtdEstoque\":0,\"dataCadastro\":\"2025-04-26\",\"disponivel\":false";
        var mapper = JsonMapper.builder().build();
        long id = mapper.readTree(enviar("POST", "/produtos", "{" + dados + "}")).get("id").asLong();
        try {
            assertThat(id).isPositive();
            assertThat(produtoRepository.count()).isEqualTo(quantidadeAntes + 1);
            var cadastrado = produtoRepository.findById(id).orElseThrow();
            assertThat(cadastrado.getNome()).isEqualTo("Produto teste 17");
            assertThat(cadastrado.getDataCadastro()).isEqualTo(LocalDate.of(2025, 4, 26));
            assertThat(cadastrado.getPreco()).isEqualByComparingTo(new BigDecimal("2.45"));
            assertThat(cadastrado.getQtdEstoque()).isZero();
            assertThat(cadastrado.isDisponivel()).isFalse();

            String alteracao = "{\"id\":" + id + "," + dados.replace("Produto teste 17", "Produto alterado 17")
                .replace("\"qtdEstoque\":0", "\"qtdEstoque\":10")
                .replace("\"disponivel\":false", "\"disponivel\":true") + "}";
            assertThat(mapper.readTree(enviar("PUT", "/produtos", alteracao)).get("id").asLong()).isEqualTo(id);
            var recuperado = mapper.readTree(enviar("GET", "/produtos/" + id, null));
            assertThat(recuperado.get("nome").asText()).isEqualTo("Produto alterado 17");
            assertThat(recuperado.get("qtdEstoque").asInt()).isEqualTo(10);
            assertThat(recuperado.get("disponivel").asBoolean()).isTrue();
            assertThat(recuperado.get("categoria").get("id").asLong()).isEqualTo(categoriaId);
            assertThat(produtoRepository.count()).isEqualTo(quantidadeAntes + 1);
        } finally {
            produtoRepository.deleteById(id);
        }
        assertThat(produtoRepository.count()).isEqualTo(quantidadeAntes);
    }

    private String enviar(String metodo, String caminho, String json) throws Exception {
        var conexao = (HttpURLConnection) URI.create("http://localhost:" + port + caminho).toURL().openConnection();
        try {
            conexao.setRequestMethod(metodo);
            conexao.setConnectTimeout(10000);
            conexao.setReadTimeout(10000);
            if (json != null) {
                conexao.setDoOutput(true);
                conexao.setRequestProperty("Content-Type", "application/json");
                try (var corpo = conexao.getOutputStream()) {
                    corpo.write(json.getBytes(StandardCharsets.UTF_8));
                }
            }
            int status = conexao.getResponseCode();
            var fluxo = status < 400 ? conexao.getInputStream() : conexao.getErrorStream();
            String resposta = fluxo == null ? "" : new String(fluxo.readAllBytes(), StandardCharsets.UTF_8);
            assertThat(status).as("%s %s: %s", metodo, caminho, resposta).isBetween(200, 299);
            return resposta;
        } finally {
            conexao.disconnect();
        }
    }
}

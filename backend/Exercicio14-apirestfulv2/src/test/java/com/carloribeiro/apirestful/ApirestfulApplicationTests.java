package com.carloribeiro.apirestful;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import com.carloribeiro.apirestful.controller.AutenticacaoController;
import com.carloribeiro.apirestful.mapper.CategoriaMapper;
import com.carloribeiro.apirestful.mapper.ProdutoMapper;
import com.carloribeiro.apirestful.model.Usuario;
import com.carloribeiro.apirestful.repository.CategoriaRepository;
import com.carloribeiro.apirestful.repository.ProdutoRepository;
import com.carloribeiro.apirestful.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApirestfulApplicationTests {
    @Value("${local.server.port}") private int port;
    @Autowired private ApirestfulApplication application;
    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ProdutoMapper produtoMapper;
    @Autowired private CategoriaMapper categoriaMapper;
    @Autowired private AutenticacaoController autenticacaoController;

    @Test
    void contextLoads() {
        assertThat(produtoMapper).isNotNull();
        assertThat(categoriaMapper).isNotNull();
    }

    @Test
    void reiniciarNaoDeveDuplicarDados() throws Exception {
        long produtos = produtoRepository.count();
        long categorias = categoriaRepository.count();
        long usuarios = usuarioRepository.count();
        application.run();
        assertThat(produtoRepository.count()).isEqualTo(produtos);
        assertThat(categoriaRepository.count()).isEqualTo(categorias);
        assertThat(usuarioRepository.count()).isEqualTo(usuarios);
    }

    @Test
    void deveFiltrarEPaginarProdutos() {
        var pagina = produtoRepository.recuperarProdutosComPaginacao(PageRequest.of(0, 1), "%Abacate%");
        assertThat(pagina.getTotalElements()).isEqualTo(1);
        assertThat(pagina.getTotalPages()).isEqualTo(1);
        assertThat(pagina.getContent()).hasSize(1);
        var dto = produtoMapper.toProdutoComCategoriaResumo(pagina.getContent().getFirst());
        assertThat(dto.nome()).isEqualTo("Abacate");
        assertThat(dto.categoriaResumo().nome()).isEqualTo("Fruta");
    }

    @Test
    void deveMapearCategoriaComProdutos() {
        var categoria = categoriaRepository.recuperarCategoriaPorIdComProdutos(
                categoriaRepository.findAll().getFirst().getId()).orElseThrow();
        var dto = categoriaMapper.toCategoriaResumoComProdutos(categoria);
        assertThat(dto.produtosSemCategoriaResumo()).isNotEmpty();
    }

    @Test
    void deveAutenticarSomenteCredenciaisValidas() {
        var resposta = autenticacaoController.login(new Usuario("admin", "desweb"));
        assertThat(resposta.token()).isEqualTo(Long.toString(resposta.idUsuario()));
        assertThat(resposta.idUsuario()).isPositive();
        assertThat(resposta.nome()).isEqualTo("admin");
        assertThat(resposta.role()).isEqualTo("ADMIN");
        var usuarioComum = autenticacaoController.login(new Usuario("user", "desweb"));
        assertThat(usuarioComum.idUsuario()).isPositive();
        assertThat(usuarioComum.role()).isEqualTo("USER");
        var invalida = autenticacaoController.login(new Usuario("admin", "incorreta"));
        assertThat(invalida.token()).isEmpty();
        assertThat(invalida.idUsuario()).isZero();
        assertThat(invalida.nome()).isEmpty();
        assertThat(invalida.role()).isEmpty();
    }

    @Test
    void deveResponderConsultasHttpERejeitarPaginacaoInvalida() throws Exception {
        for (String caminho : new String[] {"/produtos", "/produtos/paginacao?pagina=0&tamanho=5",
                "/produtos/" + produtoRepository.findAll().getFirst().getId(),
                "/produtos/mapstruct?comCategoria=true"}) {
            var conexao = conectar(caminho);
            try {
                assertThat(conexao.getResponseCode()).as(caminho).isEqualTo(200);
                assertThat(new String(conexao.getInputStream().readAllBytes(), StandardCharsets.UTF_8))
                        .contains("Abacate");
            } finally {
                conexao.disconnect();
            }
        }
        for (String consulta : new String[] {"pagina=-1&tamanho=5", "pagina=0&tamanho=0"}) {
            var conexao = conectar("/produtos/paginacao?" + consulta);
            try {
                assertThat(conexao.getResponseCode()).isEqualTo(400);
            } finally {
                conexao.disconnect();
            }
        }
    }

    @Test
    void deveRetornarOsQuatroCamposNoLoginHttp() throws Exception {
        for (String senha : new String[] {"desweb", "incorreta"}) {
            var conexao = conectar("/autenticacao/login");
            try {
                conexao.setRequestMethod("POST");
                conexao.setRequestProperty("Content-Type", "application/json");
                conexao.setDoOutput(true);
                try (var corpo = conexao.getOutputStream()) {
                    corpo.write(("{\"conta\":\"admin\",\"senha\":\"" + senha + "\"}")
                            .getBytes(StandardCharsets.UTF_8));
                }
                assertThat(conexao.getResponseCode()).isEqualTo(200);
                var resposta = new String(conexao.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                assertThat(resposta).contains("\"token\":\"", "\"idUsuario\":", "\"nome\":\"", "\"role\":\"");
                assertThat(resposta).doesNotContain("senha");
                if (senha.equals("desweb")) {
                    assertThat(resposta).contains("\"nome\":\"admin\"", "\"role\":\"ADMIN\"");
                } else {
                    assertThat(resposta).contains("\"token\":\"\"", "\"idUsuario\":0", "\"role\":\"\"");
                }
            } finally {
                conexao.disconnect();
            }
        }
    }

    private HttpURLConnection conectar(String caminho) throws Exception {
        var conexao = (HttpURLConnection) URI.create("http://localhost:" + port + caminho).toURL().openConnection();
        conexao.setConnectTimeout(10000);
        conexao.setReadTimeout(10000);
        return conexao;
    }
}

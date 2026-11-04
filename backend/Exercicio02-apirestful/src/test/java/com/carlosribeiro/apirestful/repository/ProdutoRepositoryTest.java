package com.carlosribeiro.apirestful.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;

import com.carlosribeiro.apirestful.model.Categoria;
import com.carlosribeiro.apirestful.model.Produto;

@DataJpaTest
class ProdutoRepositoryTest {
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @BeforeEach
    void prepararProdutos() {
        produtoRepository.deleteAll();
        categoriaRepository.deleteAll();
        Categoria categoria = categoriaRepository.save(new Categoria("fruta"));
        for (int i = 0; i < 6; i++) {
            salvarProduto("Abacate " + i, categoria);
        }
        for (int i = 0; i < 6; i++) {
            salvarProduto("Banana " + i, categoria);
        }
        produtoRepository.flush();
    }

    private void salvarProduto(String nome, Categoria categoria) {
        produtoRepository.save(new Produto("produto.png", nome, "1 unidade", true,
                10, BigDecimal.ONE, LocalDate.of(2025, 4, 26), categoria));
    }

    @Test
    void deveContarSomenteProdutosDaPesquisa() {
        var pagina = produtoRepository.recuperarProdutosComPaginacao(PageRequest.of(0, 2), "%Abacate%");

        assertThat(pagina.getContent()).hasSize(2);
        assertThat(pagina.getTotalElements()).isEqualTo(6);
        assertThat(pagina.getTotalPages()).isEqualTo(3);
        assertThat(pagina.getContent()).allMatch(produto -> produto.getNome().startsWith("Abacate"));
    }

    @Test
    void deveRetornarZeroPaginasQuandoPesquisaNaoEncontraProdutos() {
        var pagina = produtoRepository.recuperarProdutosComPaginacao(PageRequest.of(0, 5), "%Inexistente%");

        assertThat(pagina.getContent()).isEmpty();
        assertThat(pagina.getTotalElements()).isZero();
        assertThat(pagina.getTotalPages()).isZero();
    }
}

package com.carlosribeiro.apirestful.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.test.util.ReflectionTestUtils;

import com.carlosribeiro.apirestful.model.Categoria;
import com.carlosribeiro.apirestful.model.Produto;

class ProdutoMapperTest {
    private final ProdutoMapper produtoMapper = Mappers.getMapper(ProdutoMapper.class);

    private Produto criarProduto() {
        Categoria categoria = new Categoria("fruta");
        categoria.setId(1L);
        Produto produto = new Produto("abacate.png", "Abacate", "1 unidade", true,
                100, new BigDecimal("2.45"), LocalDate.of(2025, 4, 26), categoria);
        produto.setId(10L);
        return produto;
    }

    @Test
    void deveGerarResumoComCategoria() {
        var resumo = produtoMapper.toProdutoComCategoriaResumo(criarProduto());

        assertThat(resumo.id()).isEqualTo(10L);
        assertThat(resumo.nome()).isEqualTo("Abacate");
        assertThat(resumo.preco()).isEqualByComparingTo("2.45");
        assertThat(resumo.categoriaResumo().id()).isEqualTo(1L);
        assertThat(resumo.categoriaResumo().nome()).isEqualTo("fruta");
    }

    @Test
    void deveGerarListaSemCategoria() {
        var resumos = produtoMapper.toProdutosSemCategoriaResumo(List.of(criarProduto()));

        assertThat(resumos).hasSize(1);
        assertThat(resumos.getFirst().nome()).isEqualTo("Abacate");
    }

    @Test
    void devePreservarResumoSingularDaCategoria() {
        Produto produto = criarProduto();
        Categoria categoria = produto.getCategoria();
        categoria.setProdutos(List.of(produto));
        CategoriaMapper categoriaMapper = Mappers.getMapper(CategoriaMapper.class);
        ReflectionTestUtils.setField(categoriaMapper, "produtoMapper", produtoMapper);

        var resumo = categoriaMapper.toCategoriaResumoComProdutos(categoria);

        assertThat(resumo.nome()).isEqualTo("fruta");
        assertThat(resumo.produtoSemCategoriaResumo().nome()).isEqualTo("Abacate");
    }

    @Test
    void deveTratarCategoriaSemProdutos() {
        Categoria categoria = new Categoria("fruta");
        categoria.setProdutos(List.of());
        CategoriaMapper categoriaMapper = Mappers.getMapper(CategoriaMapper.class);
        ReflectionTestUtils.setField(categoriaMapper, "produtoMapper", produtoMapper);

        assertThat(categoriaMapper.toCategoriaResumoComProdutos(categoria)
                .produtoSemCategoriaResumo()).isNull();
    }
}

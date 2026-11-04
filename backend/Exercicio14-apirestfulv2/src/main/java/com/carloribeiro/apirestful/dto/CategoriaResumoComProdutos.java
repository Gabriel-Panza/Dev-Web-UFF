package com.carloribeiro.apirestful.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CategoriaResumoComProdutos(
    Long id,
    String nome,
    @JsonProperty("produtos")
    List<ProdutoSemCategoriaResumo> produtosSemCategoriaResumo) {
}

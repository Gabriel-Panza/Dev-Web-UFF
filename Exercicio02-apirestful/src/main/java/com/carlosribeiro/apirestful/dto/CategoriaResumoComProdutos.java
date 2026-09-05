package com.carlosribeiro.apirestful.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CategoriaResumoComProdutos(
        Long id,
        String nome,
        @JsonProperty("produtos") ProdutoSemCategoriaResumo produtoSemCategoriaResumo) {
    
}

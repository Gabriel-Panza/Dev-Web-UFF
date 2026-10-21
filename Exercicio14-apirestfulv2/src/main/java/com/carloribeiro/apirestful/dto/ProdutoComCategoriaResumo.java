package com.carloribeiro.apirestful.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record ProdutoComCategoriaResumo(Long id,
                                        String nome,
                                        BigDecimal preco,
                                        @JsonProperty("categoria")
                                        CategoriaResumo categoriaResumo) {
}

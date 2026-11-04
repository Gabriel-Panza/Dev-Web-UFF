package com.carloribeiro.apirestful.dto;

import java.math.BigDecimal;

public record ProdutoDto(Long id,
                         String nome,
                         BigDecimal preco,
                         CategoriaDto categoria) {
}

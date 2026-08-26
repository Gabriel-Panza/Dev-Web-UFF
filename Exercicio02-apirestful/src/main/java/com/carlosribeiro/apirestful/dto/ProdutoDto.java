package com.carlosribeiro.apirestful.dto;

import java.math.BigDecimal;

public record ProdutoDto(Long id, String nome, BigDecimal preco, CategoriaDto categoria) {
    
}

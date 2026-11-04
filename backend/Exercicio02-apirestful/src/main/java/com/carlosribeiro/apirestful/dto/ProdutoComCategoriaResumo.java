package com.carlosribeiro.apirestful.dto;

import java.math.BigDecimal;

public record ProdutoComCategoriaResumo(long id, String nome, BigDecimal preco, CategoriaResumo categoriaResumo) {
    
}

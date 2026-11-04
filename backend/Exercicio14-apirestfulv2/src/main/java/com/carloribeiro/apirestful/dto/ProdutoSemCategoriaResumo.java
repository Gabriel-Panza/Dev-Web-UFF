package com.carloribeiro.apirestful.dto;

import java.math.BigDecimal;

public record ProdutoSemCategoriaResumo(Long id,
                                        String nome,
                                        BigDecimal preco) {
}

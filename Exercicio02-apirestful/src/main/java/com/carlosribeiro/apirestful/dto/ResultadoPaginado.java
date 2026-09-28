package com.carlosribeiro.apirestful.dto;

import java.util.List;

public record ResultadoPaginado<T>(Long totalDeItens,
                                int totalDePaginas,
                                int PaginaCorrente,
                                List<T> itens)
{}
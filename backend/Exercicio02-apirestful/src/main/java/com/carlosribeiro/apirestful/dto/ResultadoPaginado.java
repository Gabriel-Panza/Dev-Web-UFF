package com.carlosribeiro.apirestful.dto;

import java.util.List;

public record ResultadoPaginado<T>(Long totalDeItens,
                                int totalDePaginas,
                                int paginaCorrente,
                                List<T> itens)
{}

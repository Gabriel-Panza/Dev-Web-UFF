package com.carlosribeiro.apirestful.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.carlosribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carlosribeiro.apirestful.model.Categoria;

@Mapper(componentModel = "spring", uses = {ProdutoMapper.class})
public interface CategoriaMapper {
    @Mapping(source = "produtos", target = "produtoSemCategoriaResumo")
    CategoriaResumoComProdutos toCategoriaResumoComProdutos(Categoria categoria);
}

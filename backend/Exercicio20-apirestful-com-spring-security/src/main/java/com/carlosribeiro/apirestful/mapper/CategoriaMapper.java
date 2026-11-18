package com.carlosribeiro.apirestful.mapper;

import com.carlosribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carlosribeiro.apirestful.model.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProdutoMapper.class)
public interface CategoriaMapper {
    @Mapping(source = "produtos", target = "produtosSemCategoriaResumo")
    CategoriaResumoComProdutos toCategoriaResumoComProdutos(Categoria categoria);
}

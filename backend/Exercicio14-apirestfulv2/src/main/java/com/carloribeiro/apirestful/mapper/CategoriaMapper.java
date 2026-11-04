package com.carloribeiro.apirestful.mapper;

import com.carloribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carloribeiro.apirestful.model.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProdutoMapper.class)
public interface CategoriaMapper {
    @Mapping(source = "produtos", target = "produtosSemCategoriaResumo")
    CategoriaResumoComProdutos toCategoriaResumoComProdutos(Categoria categoria);
}

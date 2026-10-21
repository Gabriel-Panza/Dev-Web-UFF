package com.carloribeiro.apirestful.mapper;

import com.carloribeiro.apirestful.dto.ProdutoComCategoriaResumo;
import com.carloribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carloribeiro.apirestful.model.Produto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProdutoMapper {
    List<ProdutoComCategoriaResumo> toProdutosComCategoriaResumo(List<Produto> produtos);
    List<ProdutoSemCategoriaResumo> toProdutosSemCategoriaResumo(List<Produto> produtos);

    @Mapping(source = "categoria", target = "categoriaResumo")
    ProdutoComCategoriaResumo toProdutoComCategoriaResumo(Produto produto);
    ProdutoSemCategoriaResumo toProdutoSemCategoriaResumo(Produto produto);
}

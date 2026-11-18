package com.carlosribeiro.apirestful.mapper;

import com.carlosribeiro.apirestful.dto.ProdutoComCategoriaResumo;
import com.carlosribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carlosribeiro.apirestful.model.Produto;
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

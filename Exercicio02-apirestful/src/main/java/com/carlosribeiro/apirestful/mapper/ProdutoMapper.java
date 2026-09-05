package com.carlosribeiro.apirestful.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.carlosribeiro.apirestful.dto.ProdutoComCategoriaResumo;
import com.carlosribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carlosribeiro.apirestful.model.Produto;

@Mapper(componentModel = "spring", uses = {CategoriaMapper.class})
public interface ProdutoMapper {
    List<ProdutoComCategoriaResumo> toProdutosComCategoriaResumo(List<Produto> produtos);
    @Mapping(target = "categoriaResumo", source = "categoria")
    ProdutoComCategoriaResumo toProdutoComCategoriaResumo(Produto produto);

    List<ProdutoSemCategoriaResumo> toProdutosSemCategoriaResumo(List<Produto> produtos);
    ProdutoSemCategoriaResumo toProdutoSemCategoriaResumo(Produto produto);

    default ProdutoSemCategoriaResumo toProdutoSemCategoriaResumo(List<Produto> produtos) {
        if (produtos == null || produtos.isEmpty()) {
            return null;
        }
        return toProdutoSemCategoriaResumo(produtos.get(0));
    }
}

package com.carlosribeiro.apirestful.mapper;

import com.carlosribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carlosribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carlosribeiro.apirestful.model.Categoria;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-02T10:09:13-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CategoriaMapperImpl implements CategoriaMapper {

    @Autowired
    private ProdutoMapper produtoMapper;

    @Override
    public CategoriaResumoComProdutos toCategoriaResumoComProdutos(Categoria categoria) {
        if ( categoria == null ) {
            return null;
        }

        ProdutoSemCategoriaResumo produtoSemCategoriaResumo = null;
        Long id = null;
        String nome = null;

        produtoSemCategoriaResumo = produtoMapper.toProdutoSemCategoriaResumo( categoria.getProdutos() );
        id = categoria.getId();
        nome = categoria.getNome();

        CategoriaResumoComProdutos categoriaResumoComProdutos = new CategoriaResumoComProdutos( id, nome, produtoSemCategoriaResumo );

        return categoriaResumoComProdutos;
    }
}

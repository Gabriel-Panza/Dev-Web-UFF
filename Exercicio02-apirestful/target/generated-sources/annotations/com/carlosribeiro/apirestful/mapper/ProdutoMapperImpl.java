package com.carlosribeiro.apirestful.mapper;

import com.carlosribeiro.apirestful.dto.CategoriaResumo;
import com.carlosribeiro.apirestful.dto.ProdutoComCategoriaResumo;
import com.carlosribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carlosribeiro.apirestful.model.Categoria;
import com.carlosribeiro.apirestful.model.Produto;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-14T09:15:16-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.4 (Eclipse Adoptium)"
)
@Component
public class ProdutoMapperImpl implements ProdutoMapper {

    @Override
    public List<ProdutoComCategoriaResumo> toProdutosComCategoriaResumo(List<Produto> produtos) {
        if ( produtos == null ) {
            return null;
        }

        List<ProdutoComCategoriaResumo> list = new ArrayList<ProdutoComCategoriaResumo>( produtos.size() );
        for ( Produto produto : produtos ) {
            list.add( toProdutoComCategoriaResumo( produto ) );
        }

        return list;
    }

    @Override
    public ProdutoComCategoriaResumo toProdutoComCategoriaResumo(Produto produto) {
        if ( produto == null ) {
            return null;
        }

        CategoriaResumo categoriaResumo = null;
        long id = 0L;
        String nome = null;
        BigDecimal preco = null;

        categoriaResumo = categoriaToCategoriaResumo( produto.getCategoria() );
        if ( produto.getId() != null ) {
            id = produto.getId();
        }
        nome = produto.getNome();
        preco = produto.getPreco();

        ProdutoComCategoriaResumo produtoComCategoriaResumo = new ProdutoComCategoriaResumo( id, nome, preco, categoriaResumo );

        return produtoComCategoriaResumo;
    }

    @Override
    public List<ProdutoSemCategoriaResumo> toProdutosSemCategoriaResumo(List<Produto> produtos) {
        if ( produtos == null ) {
            return null;
        }

        List<ProdutoSemCategoriaResumo> list = new ArrayList<ProdutoSemCategoriaResumo>( produtos.size() );
        for ( Produto produto : produtos ) {
            list.add( toProdutoSemCategoriaResumo( produto ) );
        }

        return list;
    }

    @Override
    public ProdutoSemCategoriaResumo toProdutoSemCategoriaResumo(Produto produto) {
        if ( produto == null ) {
            return null;
        }

        Long id = null;
        String nome = null;
        BigDecimal preco = null;

        id = produto.getId();
        nome = produto.getNome();
        preco = produto.getPreco();

        ProdutoSemCategoriaResumo produtoSemCategoriaResumo = new ProdutoSemCategoriaResumo( id, nome, preco );

        return produtoSemCategoriaResumo;
    }

    protected CategoriaResumo categoriaToCategoriaResumo(Categoria categoria) {
        if ( categoria == null ) {
            return null;
        }

        Long id = null;
        String nome = null;

        id = categoria.getId();
        nome = categoria.getNome();

        CategoriaResumo categoriaResumo = new CategoriaResumo( id, nome );

        return categoriaResumo;
    }
}

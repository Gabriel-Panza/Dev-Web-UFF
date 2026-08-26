package com.carlosribeiro.apirestful.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.carlosribeiro.apirestful.dto.CategoriaDto;
import com.carlosribeiro.apirestful.dto.ProdutoDto;
import com.carlosribeiro.apirestful.model.Categoria;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaDto recuperarCategoriaDtoComProdutos(Long id) {
        Categoria categoria = categoriaRepository.recuperarCategoriaComProdutos(id);
        List<ProdutoDto> produtosDto = new ArrayList<>();
        for (Produto produto : categoria.getProdutos()){
            produtosDto.add(new ProdutoDto(produto.getId(), 
                                           produto.getNome(), 
                                           produto.getPreco(),
                                           null));
        }
        return new CategoriaDto(categoria.getId(), categoria.getNome(), produtosDto);
    }

}

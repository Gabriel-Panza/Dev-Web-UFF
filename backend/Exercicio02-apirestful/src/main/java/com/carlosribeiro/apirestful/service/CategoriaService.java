package com.carlosribeiro.apirestful.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carlosribeiro.apirestful.dto.CategoriaDto;
import com.carlosribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carlosribeiro.apirestful.dto.ProdutoDto;
import com.carlosribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carlosribeiro.apirestful.mapper.CategoriaMapper;
import com.carlosribeiro.apirestful.model.Categoria;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    @Autowired
    private CategoriaMapper categoriaMapper;

    public CategoriaDto recuperarCategoriaDtoComProdutos(Long id) {
        Categoria categoria = categoriaRepository.recuperarCategoriaComProdutos(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria com id " + id + " não encontrada"));
        List<ProdutoDto> produtosDto = new ArrayList<>();
        for (Produto produto : categoria.getProdutos()){
            produtosDto.add(new ProdutoDto(produto.getId(), 
                                           produto.getNome(), 
                                           produto.getPreco(),
                                           null));
        }
        return new CategoriaDto(categoria.getId(), categoria.getNome(), produtosDto);
    }

    public CategoriaResumoComProdutos recuperarCategoriaResumoComProdutos(Long id) {
        Categoria categoria = categoriaRepository.recuperarCategoriaComProdutos(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria com id " + id + " não encontrada"));
        return categoriaMapper.toCategoriaResumoComProdutos(categoria);
    }

}

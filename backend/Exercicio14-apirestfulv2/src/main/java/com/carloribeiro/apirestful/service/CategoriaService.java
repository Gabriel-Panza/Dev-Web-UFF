package com.carloribeiro.apirestful.service;

import com.carloribeiro.apirestful.dto.CategoriaDto;
import com.carloribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carloribeiro.apirestful.dto.ProdutoDto;
import com.carloribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carloribeiro.apirestful.mapper.CategoriaMapper;
import com.carloribeiro.apirestful.model.Categoria;
import com.carloribeiro.apirestful.model.Produto;
import com.carloribeiro.apirestful.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public CategoriaDto recuperarCategoriaDtoComProdutosDto(Long id) {
        Categoria categoria = categoriaRepository
            .recuperarCategoriaPorIdComProdutos(id)
            .orElseThrow(() -> new EntidadeNaoEncontradaException(
                "Categoria com id = " + id + " não encontrada"));
        List<ProdutoDto> lista = new ArrayList<>();
        for (Produto produto : categoria.getProdutos()) {
            lista.add(new ProdutoDto(produto.getId(),
                                     produto.getNome(),
                                     produto.getPreco(),
                                     null));
        }
        return new CategoriaDto(categoria.getId(), categoria.getNome(), lista);
    }

    public CategoriaResumoComProdutos recuperarCategoriaResumoComProdutos(Long id) {
        Categoria categoria = categoriaRepository.recuperarCategoriaPorIdComProdutos(id)
            .orElseThrow(() -> new EntidadeNaoEncontradaException(
                "Categoria com id = " + id + " não encontrada"));
        return categoriaMapper.toCategoriaResumoComProdutos(categoria);
    }
}

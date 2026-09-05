package com.carlosribeiro.apirestful.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.carlosribeiro.apirestful.dto.CategoriaDto;
import com.carlosribeiro.apirestful.dto.ProdutoComCategoriaResumo;
import com.carlosribeiro.apirestful.dto.ProdutoDto;
import com.carlosribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carlosribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carlosribeiro.apirestful.mapper.ProdutoMapper;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.repository.ProdutoRepository;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private ProdutoMapper produtoMapper;

    public List<Produto> recuperarProdutos(){
        return produtoRepository.findAll();
    }

    public List<ProdutoDto> recuperarProdutosDto(boolean comCategoria) {
        if (comCategoria) {
            List<Produto> produtos = produtoRepository.recuperarProdutosComCategoria();
            List<ProdutoDto> listaProdutosDto = new ArrayList<>();
            for (Produto produto : produtos) {
                listaProdutosDto.add(new ProdutoDto(produto.getId(), 
                                                    produto.getNome(), 
                                                    produto.getPreco(), 
                                                    new CategoriaDto(produto.getCategoria().getId(), produto.getCategoria().getNome(), null)));
            }
            return listaProdutosDto;
        } else {
            List<Produto> produtos = produtoRepository.findAll();
            List<ProdutoDto> listaProdutosDto = new ArrayList<>();
            for (Produto produto : produtos) {
                listaProdutosDto.add(new ProdutoDto(produto.getId(), 
                                                    produto.getNome(), 
                                                    produto.getPreco(), 
                                                    null));
            }
            return listaProdutosDto;
        }
    }

    public Produto recuperarUmProdutoPorId(Long id){
        return produtoRepository.findById(id)
        .orElseThrow(() -> new EntidadeNaoEncontradaException(
            "Produto com id = " + id + " não encontrado."));
    }

    public Produto cadastrarProduto(Produto produto){
        return produtoRepository.save(produto);
    }

    public Produto alterarProduto(Produto produto){
        return produtoRepository.save(produto);
    }

    public void deletarUmProdutoPorId(Long id){
        produtoRepository.deleteById(id);
    }

    public List<ProdutoComCategoriaResumo> recuperarProdutosDtoComCategoriaResumo() {
        List<Produto> produtos = produtoRepository.recuperarProdutosComCategoria();
        return produtoMapper.toProdutosComCategoriaResumo(produtos);
    }

    public List<ProdutoSemCategoriaResumo> recuperarProdutosDtoSemCategoriaResumo() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtoMapper.toProdutosSemCategoriaResumo(produtos);
    }
}

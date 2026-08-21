package com.carlosribeiro.apirestful.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.repository.ProdutoRepository;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> recuperarProdutos(){
        return produtoRepository.findAll();
    }

    public Produto cadastrarProduto(Produto produto){
        return produtoRepository.save(produto);
    }
}

package com.carlosribeiro.apirestful.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.carlosribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.repository.ProdutoRepository;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> recuperarProdutos(){
        return produtoRepository.findAll();
    }

    public ResponseEntity<?> recuperarUmProdutoPorId(Long id){
        try {
            Produto produto = produtoRepository.findById(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Produto com id = " + id + " não encontrado."));
            return new ResponseEntity<>(produto, HttpStatus.OK);
        } catch(EntidadeNaoEncontradaException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

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
}

package com.carlosribeiro.apirestful.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carlosribeiro.apirestful.dto.ProdutoDto;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.service.ProdutoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    @GetMapping     //GET para http://localhost:8080/produtos
    public List<Produto> recuperarProdutos(){
        return produtoService.recuperarProdutos();
    }

    @GetMapping("resumo")     //GET para http://localhost:8080/produtos/resumo?comCategoria=true
    public List<ProdutoDto> recuperarProdutosDto(@RequestParam(name = "comCategoria", defaultValue = "false") boolean comCategoria){
        return produtoService.recuperarProdutosDto(comCategoria);
    }

    @GetMapping("{idProduto}")     //GET para http://localhost:8080/produtos/1
    public ResponseEntity<?> recuperarUmProdutoPorId(@PathVariable("idProduto") Long id){
        return produtoService.recuperarUmProdutoPorId(id);
    }

    @PostMapping
    public Produto cadastrarProduto(@RequestBody Produto produto){
        return produtoService.cadastrarProduto(produto);
    }

    @PutMapping
    public Produto alterarProduto(@RequestBody Produto produto){
        return produtoService.alterarProduto(produto);
    }

    @DeleteMapping("{idProduto}")
    public void deletarUmProdutoPorId(@PathVariable("idProduto") Long id){
        produtoService.deletarUmProdutoPorId(id);
    }

}

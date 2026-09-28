package com.carlosribeiro.apirestful.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carlosribeiro.apirestful.dto.ProdutoDto;
import com.carlosribeiro.apirestful.dto.ResultadoPaginado;
import com.carlosribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.service.ProdutoService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin("http://localhost:5173")
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

    @GetMapping("mapstruct")     //GET para http://localhost:8080/produtos/mapstruct?comCategoria=true
    public List<?> recuperarProdutosDtoComOuSemCategoriaResumo(@RequestParam(name = "comCategoria", defaultValue = "false") boolean comCategoria){
        if (comCategoria) {
            return produtoService.recuperarProdutosDtoComCategoriaResumo();
        }
        return produtoService.recuperarProdutosDtoSemCategoriaResumo();
    }

    @GetMapping("{idProduto}")     //GET para http://localhost:8080/produtos/1
    public ResponseEntity<?> recuperarUmProdutoPorId(@PathVariable("idProduto") Long id){
        try {
            Produto produto = produtoService.recuperarUmProdutoPorId(id);
            return new ResponseEntity<>(produto, HttpStatus.OK);
        } catch(EntidadeNaoEncontradaException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
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

    // http://localhost:8080/produtos/paginacao?pagina=0&tamanho=5
    @GetMapping("paginacao") // Consulta sql de produto com left join categoria com limit 5 e offset 10
    public ResultadoPaginado<Produto> recuperarProdutosComPaginacao(
        @RequestParam(name = "pagina", defaultValue = "0") int pagina,
        @RequestParam(name = "tamanho", defaultValue = "5") int tamanho
    ) {
        PageRequest pageRequest = PageRequest.of(pagina, tamanho);
        Page<Produto> page = produtoService.recuperarProdutosComPaginacao(pageRequest);
        return new ResultadoPaginado<>(page.getTotalElements(), page.getTotalPages(), page.getNumber(), page.getContent());
    }
    

}

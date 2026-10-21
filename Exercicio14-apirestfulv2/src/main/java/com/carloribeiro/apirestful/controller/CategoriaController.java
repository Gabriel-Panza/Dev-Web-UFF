package com.carloribeiro.apirestful.controller;

import com.carloribeiro.apirestful.dto.CategoriaDto;
import com.carloribeiro.apirestful.dto.CategoriaResumoComProdutos;
import com.carloribeiro.apirestful.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://localhost:5173")
@RequiredArgsConstructor
@RestController
@RequestMapping("categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

//    public CategoriaController(CategoriaService categoriaService) {
//        this.categoriaService = categoriaService;
//    }

    @GetMapping("{idCategoria}")  // http://localhost:8080/categorias/1
    public CategoriaDto recuperarCategoriaDtoComProdutoDto
        (@PathVariable("idCategoria") Long id){
        return categoriaService.recuperarCategoriaDtoComProdutosDto(id);
    }

    @GetMapping("mapstruct/{idCategoria}")
    // http://localhost:8080/categorias/mapstruct/2
    public CategoriaResumoComProdutos recuperarCategoriaResumoComProdutos
        (@PathVariable("idCategoria") Long id){
        return categoriaService.recuperarCategoriaResumoComProdutos(id);
    }
}

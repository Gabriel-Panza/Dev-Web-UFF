package com.carlosribeiro.apirestful.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carlosribeiro.apirestful.dto.CategoriaDto;
import com.carlosribeiro.apirestful.service.CategoriaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("categorias")
public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("{idCategoria}") // http://localhost:8080/categorias/1
    public CategoriaDto recuperarCategoriaDtoComProdutos(
                                                        @PathVariable("idCategoria") Long id){
        return categoriaService.recuperarCategoriaDtoComProdutos(id);
    }
}

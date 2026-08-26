package com.carlosribeiro.apirestful.repository;

import com.carlosribeiro.apirestful.model.Produto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @Query("SELECT p FROM Produto p INNER JOIN FETCH p.categoria ORDER BY p.id")
    List<Produto> recuperarProdutosComCategoria();
    
}

package com.carlosribeiro.apirestful.repository;

import com.carlosribeiro.apirestful.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
}

package com.carlosribeiro.apirestful.repository;

import com.carlosribeiro.apirestful.model.Categoria;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    @Query("SELECT c FROM Categoria c LEFT JOIN FETCH c.produtos WHERE c.id = :id ORDER BY c.id")
    Optional<Categoria> recuperarCategoriaComProdutos(@Param("id") Long id);
}

package com.carloribeiro.apirestful.repository;

import com.carloribeiro.apirestful.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    @Query("select c from Categoria c " +
           "left outer join fetch c.produtos " +
           "where c.id = :id ")
    Optional<Categoria> recuperarCategoriaPorIdComProdutos(@Param("id") Long id);
}

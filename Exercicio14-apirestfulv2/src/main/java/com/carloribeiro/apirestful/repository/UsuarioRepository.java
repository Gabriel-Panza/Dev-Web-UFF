package com.carloribeiro.apirestful.repository;

import com.carloribeiro.apirestful.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByConta(String conta);

    Usuario findByContaAndSenha(String conta, String senha);

    // Usuario findByConta(String conta);
}

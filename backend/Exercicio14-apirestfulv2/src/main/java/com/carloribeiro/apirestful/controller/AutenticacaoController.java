package com.carloribeiro.apirestful.controller;

import com.carloribeiro.apirestful.dto.TokenResponse;
import com.carloribeiro.apirestful.model.Usuario;
import com.carloribeiro.apirestful.service.AutenticacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
@RequestMapping("autenticacao")   // http://localhost:8080/autenticacao
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("login")  // http://localhost:8080/autenticacao/login
    public TokenResponse login(@RequestBody Usuario usuario) {
        Usuario usuarioLogado = autenticacaoService.login(usuario);
        if (usuarioLogado != null) {
            // O token continua didático: o ID convertido para texto, não um JWT.
            String role = "admin".equals(usuarioLogado.getConta()) ? "ADMIN" : "USER";
            return new TokenResponse(usuarioLogado.getId().toString(),
                usuarioLogado.getId(), usuarioLogado.getConta(), role);
        } else {
            return new TokenResponse("", 0, "", "");
        }
    }
}

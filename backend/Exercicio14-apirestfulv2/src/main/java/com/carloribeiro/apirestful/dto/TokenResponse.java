package com.carloribeiro.apirestful.dto;

public record TokenResponse(String token, long idUsuario, String nome, String role) {
}


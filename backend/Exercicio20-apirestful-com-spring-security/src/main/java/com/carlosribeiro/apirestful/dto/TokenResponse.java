package com.carlosribeiro.apirestful.dto;

public record TokenResponse(String token, long idUsuario, String nome, String role) {
}


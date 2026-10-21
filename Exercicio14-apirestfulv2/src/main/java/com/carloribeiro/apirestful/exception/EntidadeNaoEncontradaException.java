package com.carloribeiro.apirestful.exception;

public class EntidadeNaoEncontradaException extends RuntimeException {
    public EntidadeNaoEncontradaException(String msg) {
        super(msg);
    }
}

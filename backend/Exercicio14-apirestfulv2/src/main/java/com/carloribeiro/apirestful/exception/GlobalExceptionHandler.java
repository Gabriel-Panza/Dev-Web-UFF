package com.carloribeiro.apirestful.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
        MethodArgumentNotValidException e, HttpServletRequest request) {
        Map<String, String> errosPorCampo = new HashMap<>();
        for (FieldError erro : e.getBindingResult().getFieldErrors()) {
            errosPorCampo.put(erro.getField(), erro.getDefaultMessage());
        }
        return badRequest(request, errosPorCampo, e.getMessage());
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleSQLIntegrityConstraintViolation(
        SQLIntegrityConstraintViolationException e, HttpServletRequest request) {
        return badRequest(request, null, e.getMessage());
    }

    private ResponseEntity<ErrorResponse> badRequest(
        HttpServletRequest request, Map<String, String> errosPorCampo, String message) {
        return ResponseEntity.badRequest().body(new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.name(),
            request.getMethod(),
            request.getRequestURI(),
            errosPorCampo,
            message));
    }

    @ExceptionHandler(EntidadeNaoEncontradaException.class)
    public ResponseEntity<ErrorResponse> handleEntidadeNaoEncontrada
        (EntidadeNaoEncontradaException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.name(),
            request.getMethod(),
            request.getRequestURI(),
            null,
            e.getMessage());
        return new ResponseEntity<>(errorResponse,HttpStatus.NOT_FOUND);
    }
}

package com.carloribeiro.apirestful.controller;

import com.carloribeiro.apirestful.dto.ProdutoDto;
import com.carloribeiro.apirestful.dto.ResultadoPaginado;
import com.carloribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carloribeiro.apirestful.model.Produto;
import com.carloribeiro.apirestful.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.constraints.Min;
import jakarta.validation.groups.Default;

// O Vite escolhe outra porta quando a 5173 já está ocupada.
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
@RestController
@RequestMapping("produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping   // GET para http://localhost:8080/produtos
    public List<Produto> recuperarProdutos() {
        return produtoService.recuperarProdutos();
    }

    @GetMapping("resumo")   // GET para http://localhost:8080/produtos/resumo?comCategoria=true
    public List<ProdutoDto> recuperarProdutosDto(
        @RequestParam(name = "comCategoria", defaultValue = "false") boolean comCategoria) {
        return produtoService.recuperarProdutosDto(comCategoria);
    }

    @GetMapping("mapstruct")
    // GET para http://localhost:8080/produtos/mapstruct?comCategoria=true
    public List<?> recuperarProdutosDtoComOuSemCategoriaResumo(
        @RequestParam(name = "comCategoria", defaultValue = "false") boolean comCategoria) {
        if (comCategoria) {
            return produtoService.recuperarProdutosDtoComCategoriaResumo();
        } else {
            return produtoService.recuperarProdutosDtoSemCategoriaResumo();
        }
    }

    // @Validated({Default.class, Produto.OnCreate.class}) valida o corpo antes de entrar no método.
    // Default reúne as regras comuns, como @NotEmpty, @NotNull, @Min e @DecimalMin.
    // OnCreate reúne a regra do POST: @Null exige que o id seja nulo.
    // No PUT, OnUpdate usa @NotNull para exigir o id.
    //
    // Diferença entre @Valid e @Validated:
    // @Valid é a anotação do Bean Validation e, sozinha neste @RequestBody, usa o grupo Default.
    // Ela valida, por exemplo, @NotEmpty no nome, mas não as regras de OnCreate e OnUpdate.
    // @Validated é do Spring e permite escolher os grupos. Só OnCreate validaria o id,
    // deixando nome, descrição e imagem de fora. Com Default e OnCreate, ambas as regras rodam.
    @PostMapping
    public Produto cadastrarProduto(
        @RequestBody @Validated({Default.class, Produto.OnCreate.class}) Produto produto) {
        return produtoService.cadastrarProduto(produto);
    }

    @PutMapping
    public Produto alterarProduto(
        @RequestBody @Validated({Default.class, Produto.OnUpdate.class}) Produto produto) {
        return produtoService.alterarProduto(produto);
    }

    @GetMapping("{idProduto}")
    // GET para http://localhost:8080/produtos/1
    public ResponseEntity<?> recuperarUmProdutoPorId(@PathVariable("idProduto") Long id) {
        try {
            Produto produto = produtoService.recuperarUmProdutoPorId(id);
            return new ResponseEntity<>(produto, HttpStatus.OK);
        } catch(EntidadeNaoEncontradaException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{idProduto}")
    // DELETE para http://localhost:8080/produtos/1
    public void removerProdutoPorId(@PathVariable("idProduto") Long id) {
        produtoService.removerProdutoPorId(id);
    }
    // http://localhost:8080/produtos/paginacao?pagina=0&tamanho=5&nome=cereja
    @GetMapping("paginacao")
    public ResultadoPaginado<Produto> recuperarProdutosComPaginacao(
        @RequestParam(name = "pagina", defaultValue = "0") @Min(0) int pagina,
        @RequestParam(name = "tamanho", defaultValue = "5") @Min(1) int tamanho,
        @RequestParam(name = "nome", defaultValue = "") String nome) {
        PageRequest pageRequest = PageRequest.of(pagina, tamanho);
        Page<Produto> page = produtoService
            .recuperarProdutosComPaginacao(pageRequest, nome);
        return new ResultadoPaginado<>(page.getTotalElements(),
                                       page.getTotalPages(),
                                       page.getNumber(),
                                       page.getContent());
    }

}

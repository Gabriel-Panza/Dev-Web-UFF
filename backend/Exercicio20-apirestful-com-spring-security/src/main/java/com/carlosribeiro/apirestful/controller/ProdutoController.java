package com.carlosribeiro.apirestful.controller;

import com.carlosribeiro.apirestful.dto.ProdutoDto;
import com.carlosribeiro.apirestful.dto.ResultadoPaginado;
import com.carlosribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carlosribeiro.apirestful.model.Produto;
import com.carlosribeiro.apirestful.service.ProdutoService;
import jakarta.validation.groups.Default;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // @Validated({Default.class, Produto.OnCreate.class}) diz ao Spring para validar esse objeto
    // antes de entrar no método. O ponto importante é que ele manda rodar dois grupos de validação:
    // Default: aqui entram as constraints comuns como @NotEmpty, @NotNull, @Min, @DecimalMin.
    // Produto.OnCreate: aqui entram as regras específicas de cadastro, como o id precisar ser nulo
    // no POST.
    // Sem o Default, o Spring irá validar apenas o grupo OnCreate e as anotações de validação para nome,
    // descrição, imagem etc. serão ignoradas.

    // Diferença entre @Valid e @Validated
    //
    // @Valid
    // Usa o Bean Validation no grupo padrão Default. É o mais comum para validar DTOs em @RequestBody.
    // Funciona bem quando você não precisa separar regras de criação e alteração.
    //
    // @Validated
    // É uma extensão do Spring sobre @Valid. A principal vantagem é permitir grupos de validação, como fizemos
    // com OnCreate e OnUpdate. Serve quando queremos regras diferentes para POST e PUT, por exemplo.
    //
    // @NotEmpty String nome pertence ao grupo Default
    // @Null(groups = OnCreate.class) Long id pertence ao grupo OnCreate
    // @NotNull(groups = OnUpdate.class) Long id pertence ao grupo OnUpdate
    // Se utilizarmos apenas @Valid, o @NotEmpty(nome) roda, mas OnCreate e OnUpdate não.
    // Se utilizarmos apenas @Validated(OnCreate.class), o @Null(id) roda, mas @NotEmpty(nome) não.
    // Se utilizarmos @Validated({Default.class, OnCreate.class}), os dois rodam.

    @PostMapping
    public Produto cadastrarProduto(@RequestBody
                                    @Validated({Default.class, Produto.OnCreate.class}) Produto produto) {
        return produtoService.cadastrarProduto(produto);
    }

    @PutMapping
    public Produto alterarProduto(@RequestBody
                                  @Validated({Default.class, Produto.OnUpdate.class}) Produto produto) {
        return produtoService.alterarProduto(produto);
    }

    @GetMapping("{idProduto}")
    // GET para http://localhost:8080/produtos/1
    public ResponseEntity<?> recuperarUmProdutoPorId(@PathVariable("idProduto") Long id) {
//      try {
//          Produto produto = produtoService.recuperarUmProdutoPorId(id);
//          return new ResponseEntity<>(produto, HttpStatus.OK);
//      } catch(EntidadeNaoEncontradaException e) {
//          return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
//      }
        Produto produto = produtoService.recuperarUmProdutoPorId(id);
        return new ResponseEntity<>(produto, HttpStatus.OK);
    }

    @DeleteMapping("{idProduto}")
    // DELETE para http://localhost:8080/produtos/1
    public void removerProdutoPorId(@PathVariable("idProduto") Long id) {
        produtoService.removerProdutoPorId(id);
    }
    // http://localhost:8080/produtos/paginacao?pagina=0&tamanho=5&nome=cereja
    @GetMapping("paginacao")
    public ResultadoPaginado<Produto> recuperarProdutosComPaginacao(
        @RequestParam(name = "pagina", defaultValue = "0") int pagina,
        @RequestParam(name = "tamanho", defaultValue = "5") int tamanho,
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

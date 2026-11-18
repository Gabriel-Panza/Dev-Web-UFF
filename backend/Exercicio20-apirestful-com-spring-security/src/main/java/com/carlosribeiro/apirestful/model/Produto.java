package com.carlosribeiro.apirestful.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Null(groups = Produto.OnCreate.class, message = "O 'Id' deve ser nulo no cadastro.")
    @NotNull(groups = Produto.OnUpdate.class, message = "O 'Id' deve ser informado na alteração.")
    private Long id;

    @NotEmpty(message = "A 'Imagem' deve ser informada.")
    private String imagem;

    @NotEmpty(message = "O 'Nome' deve ser informado.")
    private String nome;

    @NotEmpty(message = "A 'Descrição' deve ser informada.")
    private String descricao;

    @NotNull(message = "O campo 'Disponível' deve ser informado.")
    private Boolean disponivel;

    @NotNull(message = "A 'Quantidade em estoque' deve ser informada.")
    @Min(value = 0, message = "A 'Quantidade em estoque' deve ser maior ou igual a 0.")
    private Integer qtdEstoque;

    @NotNull(message = "O 'Preço' deve ser informado.")
    @DecimalMin(inclusive = true, value = "0.1", message = "O 'Preço' deve ser maior ou igual a 0.1.")
    private BigDecimal preco;

    @NotNull(message = "A 'Data de Cadastro' deve ser informada.")
    private LocalDate dataCadastro;

    @NotNull(message = "A 'Categoria' deve ser informada.")
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "PRODUTO_CATEGORIA_FK"))
    private Categoria categoria;

    public Produto(String imagem, String nome, String descricao,
                   Boolean disponivel, Integer qtdEstoque, BigDecimal preco,
                   LocalDate dataCadastro, Categoria categoria) {
        this.imagem = imagem;
        this.nome = nome;
        this.descricao = descricao;
        this.disponivel = disponivel;
        this.qtdEstoque = qtdEstoque;
        this.preco = preco;
        this.dataCadastro = dataCadastro;
        this.categoria = categoria;
    }

    public interface OnCreate {}
    public interface OnUpdate {}
}

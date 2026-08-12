package com.carlosribeiro.modelo;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Produto")
public class Produto
{
    private Long id;
    private String nome;
    private double lanceMinimo;
    private LocalDate dataCadastro;
    private LocalDate dataVenda;

    // ********* Construtores *********

    public Produto()
    {
    }

    public Produto(String nome,
                   double lanceMinimo,
                   LocalDate dataCadastro)
    {	this.nome = nome;
        this.lanceMinimo = lanceMinimo;
        this.dataCadastro = dataCadastro;
    }

    // ********* Métodos do Tipo Get *********
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId()
    {	return id;
    }

    public String getNome()
    {	return nome;
    }

    @Column(name = "LANCE_MINIMO")
    public double getLanceMinimo()
    {	return lanceMinimo;
    }

    @Column(name = "DATA_CADASTRO")
    public LocalDate getDataCadastro()
    {	return dataCadastro;
    }

    @Column(name = "DATA_VENDA")
    public LocalDate getDataVenda()
    {	return dataVenda;
    }

    // ********* Métodos do Tipo Set *********

    private void setId(Long id)
    {	this.id = id;
    }

    public void setNome(String nome)
    {	this.nome = nome;
    }

    public void setLanceMinimo(double lanceMinimo)
    {	this.lanceMinimo = lanceMinimo;
    }

    public void setDataCadastro(LocalDate dataCadastro)
    {	this.dataCadastro = dataCadastro;
    }

    public void setDataVenda(LocalDate dataVenda)
    {	this.dataVenda = dataVenda;
    }
}



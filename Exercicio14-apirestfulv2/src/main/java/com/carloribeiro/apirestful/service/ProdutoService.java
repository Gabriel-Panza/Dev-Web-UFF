package com.carloribeiro.apirestful.service;

import com.carloribeiro.apirestful.dto.CategoriaDto;
import com.carloribeiro.apirestful.dto.ProdutoComCategoriaResumo;
import com.carloribeiro.apirestful.dto.ProdutoDto;
import com.carloribeiro.apirestful.dto.ProdutoSemCategoriaResumo;
import com.carloribeiro.apirestful.exception.EntidadeNaoEncontradaException;
import com.carloribeiro.apirestful.mapper.ProdutoMapper;
import com.carloribeiro.apirestful.model.Produto;
import com.carloribeiro.apirestful.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private ProdutoMapper produtoMapper;

    public List<Produto> recuperarProdutos() {
        // return produtoRepository.findAll();
        return produtoRepository.recuperarProdutosComCategoria();
    }

    public Produto cadastrarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto alterarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto recuperarUmProdutoPorId(Long id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new EntidadeNaoEncontradaException(
                "Produto com id = " + id + " não encontrado."));
    }

    public void removerProdutoPorId(Long id) {
        produtoRepository.deleteById(id);
    }

    public List<ProdutoDto> recuperarProdutosDto(boolean comCategoria) {
        if (comCategoria) {
            List<Produto> lista = produtoRepository.recuperarProdutosComCategoria();
            List<ProdutoDto> listaDeProdutosDto = new ArrayList<>();
            for (Produto produto : lista) {
                listaDeProdutosDto.add(new ProdutoDto(produto.getId(),
                                                      produto.getNome(),
                                                      produto.getPreco(),
                                                      new CategoriaDto(produto.getCategoria().getId(),
                                                          produto.getCategoria().getNome(),
                                                          null)));
            }
            return listaDeProdutosDto;
        } else {
            List<Produto> lista = produtoRepository.findAll();
            List<ProdutoDto> listaDeProdutosDto = new ArrayList<>();
            for (Produto produto : lista) {
                listaDeProdutosDto.add(new ProdutoDto(produto.getId(),
                    produto.getNome(),
                    produto.getPreco(),
                    null));
            }
            return listaDeProdutosDto;
        }
    }

    public List<ProdutoComCategoriaResumo> recuperarProdutosDtoComCategoriaResumo() {
        List<Produto> produtos = produtoRepository.recuperarProdutosComCategoria();
        return produtoMapper.toProdutosComCategoriaResumo(produtos);
    }

    public List<ProdutoSemCategoriaResumo> recuperarProdutosDtoSemCategoriaResumo() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtoMapper.toProdutosSemCategoriaResumo(produtos);
    }

    public Page<Produto> recuperarProdutosComPaginacao(PageRequest pageRequest,
                                                       String nome) {
        return produtoRepository.recuperarProdutosComPaginacao(pageRequest, "%" + nome + "%");
    }
}

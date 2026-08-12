package com.carlosribeiro.dao.impl;

import com.carlosribeiro.dao.ProdutoDAO;
import com.carlosribeiro.excecao.ProdutoNaoEncontradoException;
import com.carlosribeiro.modelo.Produto;
import com.carlosribeiro.util.FabricaDeEntityManager;

import java.util.List;

import javax.persistence.EntityManager;

public class JPAProdutoDAO implements ProdutoDAO
{	
	public long inclui(Produto umProduto)
	{
		return 0;
//		EntityManager em = null;
//		EntityTransaction tx = null;
//
//		try
//		{	// transiente - objeto novo: ainda não persistente
//			// persistente - após ser persistido
//			// destacado - objeto persistente não vinculado a um entity manager
//// ==>
//
//
//			return umProduto.getId();
//		}
//		catch(RuntimeException e)
//		{	if (tx != null)
//			{
//// ==>
//			}
//			throw e;
//		}
//		finally
//		{
//// ==>
//		}
	}

	public Produto recuperaUmProduto(long numero) throws ProdutoNaoEncontradoException
	{
		return null;
//		EntityManager em = null;
//
//		try
//		{
//			em = FabricaDeEntityManager.criarEntityManager();
//// ==>
//
//			// Características no método find():
//			// 1. É genérico: não requer um cast.
//			// 2. Retorna null caso a linha não seja encontrada no banco.
//
//			if(umProduto == null)
//			{	throw new ProdutoNaoEncontradoException("Produto não encontrado");
//			}
//			return umProduto;
//		}
//		finally
//		{   em.close();
//		}
	}

	public void altera(Produto umProduto) throws ProdutoNaoEncontradoException
	{
//		EntityManager em = null;
//		EntityTransaction tx = null;
//		Produto produto = null;
//		try
//		{
//			em = FabricaDeEntityManager.criarEntityManager();
//			tx = em.getTransaction();
//			tx.begin();
//
//// ==>
//
//			if (produto == null) {
//// ==>
//			}
//			// O merge entre nada e tudo é tudo. Ao tentar alterar um produto deletado ele será re-inserido
//			// no banco de dados.
//// ==>
//
//// ==>
//		}
//		catch(RuntimeException e)
//		{
//			if (tx != null)
//		    {   tx.rollback();
//		    }
//		    throw e;
//		}
//		finally
//		{   em.close();
//		}
	}

	public void exclui(long numero) throws ProdutoNaoEncontradoException 
	{
//		EntityManager em = null;
//		EntityTransaction tx = null;
//
//		try
//		{
//			em = FabricaDeEntityManager.criarEntityManager();
//			tx = em.getTransaction();
//			tx.begin();
//
//// ==>
//
//			if(produto == null)
//			{	tx.rollback();
//				throw new ProdutoNaoEncontradoException("Produto não encontrado");
//			}
//
//// ==>
//			tx.commit();
//		}
//		catch(RuntimeException e)
//		{
//			if (tx != null)
//		    {   tx.rollback();
//		    }
//		    throw e;
//		}
//		finally
//		{   em.close();
//		}
	}

	public List<Produto> recuperaProdutos()
	{
		EntityManager em = null;

		try
		{	em = FabricaDeEntityManager.criarEntityManager();

			List produtos = em.createQuery("SELECT p FROM Produto p ORDER BY p.id").getResultList();
			
			return produtos;
		}
		finally
		{   em.close();
		}
	}
}
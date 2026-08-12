package com.carlosribeiro.util;

import com.carlosribeiro.dao.impl.JPAProdutoDAO;
import org.reflections.Reflections;

import java.lang.reflect.InvocationTargetException;
import java.util.Set;

public class FabricaDeDAOs
{	
	public static <T> T getDAO(Class<T> tipo)
	{
		return (T) new JPAProdutoDAO();
		// Permite que a gente investigue as classes no package "com.carlosribeiro.dao.impl"

		// Nesse momento a variável tipo estará valendo ProdutoDAO.class
		// A linha abaixo verifica se no package "com.carlosribeiro.dao.impl"
		// existe uma classe subtipo de ProdutoDAO.class.
		// Vai retornar um Set contendo a classe JPAProdutoDAO.

		// Não pode haver mais de uma classe nesse package que implemente ProdutoDAO
		// caso contrário a gente não saberia qual utilizar.

		// Retorna a classe JPAProdutoDAO na variável classe.

		// Instancia um objeto do tipo JPAProdutoDAO usando o construtor Padrão
	}
}

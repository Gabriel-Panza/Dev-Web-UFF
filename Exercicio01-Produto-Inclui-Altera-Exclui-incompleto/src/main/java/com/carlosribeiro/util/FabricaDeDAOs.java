package com.carlosribeiro.util;

import com.carlosribeiro.dao.impl.JPAProdutoDAO;
import org.reflections.Reflections;

import java.lang.reflect.InvocationTargetException;
import java.util.Set;

public class FabricaDeDAOs
{	
	public static <T> T getDAO(Class<T> tipo)
	{
		// Permite que a gente investigue as classes no package "com.carlosribeiro.dao.impl"

		Reflections reflections = new Reflections("com.carlosribeiro.dao.impl");

		// Nesse momento a variável tipo estará valendo ProdutoDAO.class
		// A linha abaixo verifica se no package "com.carlosribeiro.dao.impl"
		// existe uma classe subtipo de ProdutoDAO.class.
		// Vai retornar um Set contendo a classe JPAProdutoDAO.

		Set<Class<? extends T>> conjunto = reflections.getSubTypesOf(tipo);

		// Não pode haver mais de uma classe nesse package que implemente ProdutoDAO
		// caso contrário a gente não saberia qual utilizar.

		if (conjunto.size() != 1){
			throw new RuntimeException(
				"Deve haver 1 e apenas 1 classe que implementa a interface " + tipo.getName()
			);
		}

		// Retorna a classe JPAProdutoDAO na variável classe.

		Class<? extends T> classe = conjunto.iterator().next();
		
		// Instancia um objeto do tipo JPAProdutoDAO usando o construtor Padrão
		
		try {
			return classe.getConstructor().newInstance();
		} catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
			throw new RuntimeException(e);
		}
	}
}

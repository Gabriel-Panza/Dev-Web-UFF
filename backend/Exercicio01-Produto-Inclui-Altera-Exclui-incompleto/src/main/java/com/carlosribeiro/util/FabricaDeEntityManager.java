package com.carlosribeiro.util;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class FabricaDeEntityManager
{
	private static FabricaDeEntityManager fabrica = null;
	private EntityManagerFactory emf = null;
			
	private FabricaDeEntityManager()
	{	
		try
		{	emf = Persistence.createEntityManagerFactory("exercicio");
		}
		catch(Throwable e)
		{
			e.printStackTrace();
			System.out.println(">>>>>>>>>> Mensagem de erro: " + e.getMessage());
		}
	}

	public static EntityManager criarEntityManager()
	{	if (fabrica == null)
		{	fabrica = new FabricaDeEntityManager();
		}	

		return fabrica.emf.createEntityManager();
	}
}
package com.carlosribeiro.util;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Util
{
	private static NumberFormat nf = NumberFormat.getInstance(new Locale("pt","BR"));

	// Formatador para imprimir e efetuar o parse de objetos date-time
	private static DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");

	static
	{	nf.setMaximumFractionDigits (2);	   // O default é 3.
		nf.setMinimumFractionDigits (2);
		nf.setGroupingUsed(true);
	}

	public static String dateToStr(LocalDate umaData)
	{	return dtf.format(umaData);
	}

	public static double strToDouble(String valor)
	{	if (valor == null || "".equals(valor))
		{	return 0;
		}
		else   
		{	return Double.parseDouble(valor);
		}		
	}
	
	public static String doubleToStr(double valor)
	{	return nf.format(valor);
	}

	public static LocalDate strToLocalDate(String umaData) {
                                       //  dd/mm/aaaa
		int dia = Integer.parseInt(umaData.substring(0,2));
		int mes = Integer.parseInt(umaData.substring(3,5));
		int ano = Integer.parseInt(umaData.substring(6,10));

		// Usando o método parse() abaixo, não seria preciso efetuar o parseInt em cada campo.
		// this.dataAdmissao = LocalDate.parse(ano + "-" + mes + "-" + dia);
		// parse gera DateTimeParseException

		return LocalDate.of(ano, mes, dia);
	}
}
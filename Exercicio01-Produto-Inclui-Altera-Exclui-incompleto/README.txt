// O que é a Java Persistence API ou JPA?
// =====================================
// A JPA é uma especificação que define a implementação de um framework objeto-relacional
// que tem por objetivo permitir que objetos Java sejam persistidos e recuperados de bancos
// de dados relacionais.
//
// E o que é o Framework Hibernate?
// ===============================
// O Hibernate é uma implementação Java de um framework de mapeamento objeto-relacional.
// is an object-relational mapping solution for Java environments.
// Mapeamento Objeto-Relacional ou ORM é a técnica de programação para mapear objetos
// do domínio do problema ou objetos do modelo para tabelas e bancos de dados relacionais.
//
// O Hibernate provê uma implementação de referência para a JPA o que o torna uma ótima
// opção como ferramenta de mapeamento objeto-relacional.
//
// E o que é a Spring Data JPA?
// ===========================
// Spring Data faz parte do framework Spring. O objetivo da Spring Data JPA é reduzir
// significativamente a quantidade de código necessário para implementar a camada de acesso
// a dados.
//
// Spring Data JPA não é uma implementação da JPA. É uma biblioteca/framework que adiciona
// uma camada extra de abstração em cima da implementação da JPA (como a fornecida pelo
// Hibernate).

// SLF4J (Simple Logging Facade for Java) é uma camada de abstração. Ela permite que você
// utilize qualquer biblioteca de log. Mas porque utilizar SLF4J se temos tantos frameworks
// de log. A resposta é que você pode utilizar SLF4J sem se preocupar com a implementação
// que será efetivamente usada.

// Podemos dizer que SLF4J está para log assim como a JPA está para ORM. Isto é apenas uma
// analogia.

// Frameworks que podem ser utilizados com SLF4J:
// - reload4j
// - LOG4J
// - java.util.logging ou JDK 1.4 Logging
// - NOP
// - Jakarta Commons Logging
// - LOGBACK-CLASSIC

Logger logger = LoggerFactory.getLogger(Principal.class);
logger.error("Mensagem de log emitida utilizando o LOG4J");
// fatal - error - warning - info - debug

Conteúdo de log4j.properties (em resources):
===========================================

log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=%d{dd/MM/yyyy HH:mm:ss}-%C %M%n%5p: %m%n
log4j.rootLogger=ERROR, A1

log4j.appender.A2=org.apache.log4j.FileAppender
log4j.appender.A2.File=c:/tmp/ArquivoDeLogDaAplicacao.txt
log4j.appender.A2.layout=org.apache.log4j.PatternLayout
log4j.appender.A2.layout.ConversionPattern=%d{dd/MM/yyyy HH:mm:ss} %C %M %5p: %m%n
log4j.logger.com.carlosribeiro=ERROR, A2
log4j.additivity.com.carlosribeiro=false

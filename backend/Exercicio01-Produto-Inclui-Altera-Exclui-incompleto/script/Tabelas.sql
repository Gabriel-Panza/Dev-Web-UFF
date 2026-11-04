DROP TABLE if exists desweb.produto;

CREATE TABLE desweb.produto (
                                id INT NOT NULL AUTO_INCREMENT,
                                nome VARCHAR(30) NOT NULL,
                                lance_minimo DECIMAL(8, 2) NOT NULL,
                                data_cadastro DATE NOT NULL,
                                data_venda DATE DEFAULT NULL,
                                PRIMARY KEY (id)
)
    ENGINE = INNODB
CHARACTER SET utf8mb4;

-- InnoDB is a general-purpose storage engine that balances high reliability and high
-- performance. In MySQL 8.0, InnoDB is the default MySQL storage engine. Unless you
-- have configured a different default storage engine, issuing a CREATE TABLE statement
-- without an ENGINE clause creates an InnoDB table.

-- MySQL supports multiple Unicode character sets: utf8mb4 : A UTF-8 encoding of the
-- Unicode character set using one to four bytes per character.

INSERT INTO desweb.PRODUTO(NOME, LANCE_MINIMO, DATA_CADASTRO)
VALUES('TV SAMSUNG 40 POL', 2000, curdate());

INSERT INTO desweb.PRODUTO(NOME, LANCE_MINIMO, DATA_CADASTRO)
VALUES('TV SAMSUNG 55 POL', 2500, curdate());

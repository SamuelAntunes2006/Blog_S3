CREATE DATABASE blog_s3;
USE blog_s3;

CREATE TABLE cadastro_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INT,
    senha VARCHAR(100) NOT NULL,
    perfil_de_investidor ENUM('Conservador', 'Moderado', 'Arrojado') NOT NULL
);

CREATE TABLE investimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    valorInvestido DECIMAL(10,2) NOT NULL,
    aporteMensal DECIMAL(10,2),
    tempo_mes INT NOT NULL,
    tipoInvestimento ENUM('Tesouro Direto', 'CDB', 'Poupança') NOT NULL
);

ALTER TABLE investimento
ADD COLUMN usuario_id INT,
ADD CONSTRAINT fk_usuario
FOREIGN KEY (usuario_id) REFERENCES cadastro_usuario(id);

CREATE TABLE quiz_pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto varchar(100) NOT NULL
);

alter table quiz_pergunta modify column texto varchar(100);

CREATE TABLE quiz_alternativa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pergunta_id INT NOT NULL,
    letra CHAR(1) NOT NULL, 
    texto varchar(50)NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (pergunta_id) REFERENCES quiz_pergunta(id)
);

alter table quiz_alternativa modify column texto varchar(100);

CREATE TABLE quiz_resposta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    pergunta_id INT NOT NULL,
    alternativa_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES cadastro_usuario(id),
    FOREIGN KEY (pergunta_id) REFERENCES quiz_pergunta(id),
    FOREIGN KEY (alternativa_id) REFERENCES quiz_alternativa(id)
);

INSERT INTO quiz_pergunta (texto) VALUES
('O que é investir?'),
('O que é Tesouro Direto?'),
('O que é CDB?'),
('O que significa "rentabilidade" em investimentos?'),
('Como o blog sugere que o investidor escolha o melhor investimento?');

INSERT INTO quiz_alternativa (pergunta_id, letra, texto, correta) VALUES
-- Pergunta 1
(1, 'A', 'Gastar dinheiro sem preocupação de retorno.', FALSE),
(1, 'B', 'Aplicar dinheiro com o objetivo de obter lucro no curto, médio ou longo prazo.', TRUE),
(1, 'C', 'Guardar dinheiro sem gerar retorno.', FALSE),

-- Pergunta 2
(2, 'A', 'Um investimento em imóveis', FALSE),
(2, 'B', 'Um título do governo', TRUE),
(2, 'C', 'Uma ação de empresa privada', FALSE),

-- Pergunta 3
(3, 'A', 'Um título do governo', FALSE),
(3, 'B', 'Um investimento em ações', FALSE),
(3, 'C', 'Um título bancário', TRUE),

-- Pergunta 4
(4, 'A', 'Previsibilidade de retorno.', FALSE),
(4, 'B', 'Rendimento fixo com baixo risco.', FALSE),
(4, 'C', 'Ganhos ou perdas dependem do desempenho do mercado.', TRUE),

-- Pergunta 5:
(5, 'A', 'De acordo com suas metas e tolerância ao risco', TRUE),
(5, 'B', 'Somente considerando o retorno financeiro.', FALSE),
(5, 'C', 'De acordo com suas metas e tolerância ao risco.', FALSE);



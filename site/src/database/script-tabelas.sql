CREATE DATABASE blog_s3;
USE blog_s3;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INT NOT NULL,
    senha VARCHAR(100) NOT NULL,
    perfil ENUM('Conservador', 'Moderado', 'Arrojado') NOT NULL
);

CREATE TABLE quiz_pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(255) NOT NULL,
    alternativa_a VARCHAR(255) NOT NULL,
    alternativa_b VARCHAR(255) NOT NULL,
    alternativa_c VARCHAR(255) NOT NULL,
    correta CHAR(1) NOT NULL
);

CREATE TABLE quiz_resultado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fkusuario_id INT NOT NULL,
    pontuacao INT NOT NULL,
    total_perguntas INT NOT NULL,
    percentual DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (fkusuario_id) REFERENCES usuario(id)
);

INSERT INTO quiz_pergunta (texto, alternativa_a, alternativa_b, alternativa_c, correta) VALUES
('O que é investir?', 
 'Gastar dinheiro sem preocupação de retorno.', 
 'Aplicar dinheiro com o objetivo de obter lucro no curto, médio ou longo prazo.', 
 'Guardar dinheiro sem gerar retorno.', 
 'B'),

('O que é Tesouro Direto?', 
 'Um investimento em imóveis', 
 'Um título do governo', 
 'Uma ação de empresa privada', 
 'B'),

('O que é CDB?', 
 'Um título do governo', 
 'Um investimento em ações', 
 'Um título bancário', 
 'C'),

('O que significa "rentabilidade" em investimentos?', 
 'Previsibilidade de retorno.', 
 'Rendimento fixo com baixo risco.', 
 'Ganhos ou perdas dependem do desempenho do mercado.', 
 'C'),

('Como o blog sugere que o investidor escolha o melhor investimento?', 
 'De acordo com suas metas e tolerância ao risco.', 
 'Somente considerando o retorno financeiro.', 
 'Apenas considerando o risco.', 
 'A');

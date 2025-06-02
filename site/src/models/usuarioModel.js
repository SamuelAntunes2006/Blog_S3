const database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL - autenticar");
    const instrucaoSql = `
        SELECT id, nome_completo, email, perfil 
        FROM usuario 
        WHERE email = ? AND senha = ?;
    `;
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome_completo, email, idade, senha, perfil) {
    console.log("ACESSEI O USUARIO MODEL - cadastrar");
    const instrucaoSql = `
        INSERT INTO usuario (nome_completo, email, idade, senha, perfil)
        VALUES (?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [nome_completo, email, idade, senha, perfil]);
}

function verificarEmailExistente(email) {
    const instrucao = `
        SELECT * FROM usuario WHERE email = ?;
    `;
    return database.executar(instrucao, [email]);
}


function salvarResultadoQuiz(fkusuario_id, pontuacao, totalPerguntas, percentual) {
  const instrucaoSql = `
    INSERT INTO quiz_resultado (fkusuario_id, pontuacao, total_perguntas, percentual)
    VALUES (?, ?, ?, ?);
  `;
  return database.executar(instrucaoSql, [fkusuario_id, pontuacao, totalPerguntas, percentual]);
}

function salvarRespostaQuiz(fkusuario_id, fkpergunta_id, resposta) {
  const instrucaoSql = `
    INSERT INTO quiz_resposta (fkusuario_id, fkpergunta_id, resposta)
    VALUES (?, ?, ?);
  `;
  return database.executar(instrucaoSql, [fkusuario_id, fkpergunta_id, resposta]);
}


function pegarDistribuicaoPerfil() {
    const instrucaoSql = `
        SELECT perfil, COUNT(*) AS total
        FROM usuario
        GROUP BY perfil;
    `;
    return database.executar(instrucaoSql);
}
function pegarDesempenhoUsuarios() {
    const instrucaoSql = `
        SELECT u.nome_completo, AVG(r.percentual) AS media_percentual
        FROM quiz_resultado r
        JOIN usuario u ON u.id = r.fkusuario_id
        GROUP BY u.id, u.nome_completo;
    `;
    return database.executar(instrucaoSql);
}

function pegarRankingTop3() {
    const instrucaoSql = `
        SELECT u.nome_completo, MAX(r.percentual) AS melhor_percentual
        FROM quiz_resultado r
        JOIN usuario u ON u.id = r.fkusuario_id
        GROUP BY r.fkusuario_id, u.nome_completo
        ORDER BY melhor_percentual DESC
        LIMIT 3;
    `;
    return database.executar(instrucaoSql);
}


module.exports = {
    autenticar,
    cadastrar,
    verificarEmailExistente,
    salvarResultadoQuiz,
    pegarDistribuicaoPerfil,
    pegarDesempenhoUsuarios,
    salvarRespostaQuiz, 
    pegarRankingTop3
};

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

function salvarRespostaQuiz(fkusuario_id, fkpergunta_id, resposta) {
    const queryBuscarCorreta = `SELECT correta FROM quiz_pergunta WHERE id = ?`;

    return database.executar(queryBuscarCorreta, [fkpergunta_id])
        .then(resultado => {
            if (resultado.length === 0) {
                throw new Error("Pergunta não encontrada");
            }

            const alternativaCorreta = resultado[0].correta;
            const respostaCorreta = (resposta == alternativaCorreta);

            const instrucaoSql = `
                INSERT INTO quiz_resposta (fkusuario_id, fkpergunta_id, resposta)
                VALUES (?, ?, ?)
            `;

            return database.executar(instrucaoSql, [fkusuario_id, fkpergunta_id, resposta]);
        });

}

function salvarResultadoQuiz(fkusuario_id, acertos, totalPerguntas, percentual) {
  const instrucaoSql = `
    INSERT INTO quiz_resultado (fkusuario_id, acertos, total_perguntas, percentual)
    VALUES (?, ?, ?, ?);
  `;
  return database.executar(instrucaoSql, [fkusuario_id, acertos, totalPerguntas, percentual]);
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

function pegarRespostasDetalhadasPorUsuario(usuarioId) {
    const instrucaoSql = `
    SELECT
        CASE
            WHEN qr.resposta = qp.correta THEN 'Acertou'
            ELSE 'Errou'
        END AS status_resposta
    FROM quiz_resposta qr
    JOIN quiz_pergunta qp ON qr.fkpergunta_id = qp.id
    JOIN quiz_resultado qres ON qr.fkusuario_id = qres.fkusuario_id
    WHERE qres.fkusuario_id = ?
    AND qres.id = (
        SELECT MAX(id)
        FROM quiz_resultado
        WHERE fkusuario_id = ?
    )
    AND qr.fkusuario_id = ?;
    `;
    return database.executar(instrucaoSql, [usuarioId, usuarioId, usuarioId]);
}


module.exports = {
    autenticar,
    cadastrar,
    verificarEmailExistente,
    salvarResultadoQuiz,
    pegarDistribuicaoPerfil,
    pegarDesempenhoUsuarios,
    salvarRespostaQuiz,
     pegarRespostasDetalhadasPorUsuario,
};

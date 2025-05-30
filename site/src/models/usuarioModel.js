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
function salvarRespostaQuiz(fkquiz_resultado_id, fkquiz_pergunta_id, resposta) {
  const queryBuscarCorreta = `SELECT correta FROM quiz_pergunta WHERE id = ?`;

  return database.executar(queryBuscarCorreta, [fkquiz_pergunta_id])
    .then(resultado => {
      if (resultado.length === 0) {
        throw new Error("Pergunta não encontrada");
      }

      const alternativaCorreta = resultado[0].correta;
      const respostaCorreta = (resposta === alternativaCorreta);

      const instrucaoSql = `
        INSERT INTO quiz_resposta (fkquiz_resultado_id, fkquiz_pergunta_id, resposta, correta)
        VALUES (?, ?, ?, ?);
      `;

      return database.executar(instrucaoSql, [fkquiz_resultado_id, fkquiz_pergunta_id, resposta, respostaCorreta]);
    });
}

function salvarResultadoQuiz(usuarioId, pontuacao, total_perguntas, percentual) {
  var instrucaoSql = `
    INSERT INTO quiz_resultado (fkusuario_id, pontuacao, total_perguntas, percentual)
    VALUES (?, ?, ?, ?);
  `;

  return database.executar(instrucaoSql, [usuarioId, pontuacao, total_perguntas, percentual]);
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
      qr.id AS resultado_id,
      qp.texto AS pergunta,
      qrsp.resposta AS resposta_usuario,
      qp.correta AS resposta_correta,
      CASE WHEN qrsp.resposta = qp.correta THEN TRUE ELSE FALSE END AS acertou
    FROM quiz_resultado qr
    JOIN quiz_resposta qrsp ON qr.id = qrsp.fkquiz_resultado_id
    JOIN quiz_pergunta qp ON qp.id = qrsp.fkquiz_pergunta_id
    WHERE qr.fkusuario_id = ?
    ORDER BY qr.data_resultado DESC, qp.id;
  `;
  return database.executar(instrucaoSql, [usuarioId]);
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

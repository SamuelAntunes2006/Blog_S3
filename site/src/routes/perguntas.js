const express = require('express');
const router = express.Router();
const { executar } = require('../database/config'); // ajuste o caminho se necessário

router.get('/api/resultados', (req, res) => {
    const sql = `
        SELECT u.nome_completo, u.perfil, r.pontuacao, r.percentual
        FROM quiz_resultado r
        JOIN usuario u ON u.id = r.fkusuario_id
    `;

    executar(sql)
        .then(resultados => res.json(resultados))
        .catch(err => {
            console.error('Erro ao buscar resultados:', err);
            res.status(500).send('Erro ao buscar resultados');
        });
});

router.get('/api/perguntas', (req, res) => {
    const sql = `SELECT * FROM quiz_pergunta`;

    executar(sql)
        .then(perguntas => res.json(perguntas))
        .catch(err => {
            console.error('Erro ao buscar perguntas:', err);
            res.status(500).send('Erro ao buscar perguntas');
        });
});

module.exports = router;

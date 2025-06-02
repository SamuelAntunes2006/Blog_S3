var express = require("express");
var router = express.Router();
var usuarioController = require("../controllers/usuarioController");

router.post("/salvar-respostas-quiz", usuarioController.salvarRespostasQuiz);

// Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/perfil-distribuicao", usuarioController.pegarDistribuicaoPerfil);
router.get("/desempenho-usuarios", usuarioController.pegarDesempenhoUsuarios);
router.get("/ranking-top3", usuarioController.pegarRankingTop3);

 
module.exports = router;

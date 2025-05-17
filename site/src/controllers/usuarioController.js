var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
  var nome_completo = req.body.nome_completo;
  var email = req.body.email;
  var idade = req.body.idade;
  var senha = req.body.senha;
  var perfil_de_investidor = req.body.perfil_de_investidor;

  if (!nome_completo || !email || !idade || !senha || !perfil_de_investidor) {
    res.status(400).send("Dados faltando!");
  } else {
    usuarioModel.cadastrar(nome_completo, email, idade, senha, perfil_de_investidor)
      .then(resultado => {
        res.status(201).json(resultado);
      })
      .catch(erro => {
        console.log("Erro no cadastro de usuário:", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function listar(req, res) {
  usuarioModel.listar()
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao listar usuários:", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  cadastrar,
  listar
};

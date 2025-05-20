var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
  var nome_completo = req.body.nome_completo;
  var email = req.body.email;
  var idade = req.body.idade;
  var senha = req.body.senha;
  var perfil = req.body.perfil;

  // Verifica se o e-mail já está cadastrado
  usuarioModel.verificarEmailExistente(email)
    .then(usuarios => {
      if (usuarios.length > 0) {
        return res.status(409).send("E-mail já cadastrado.");
      }
      // Se não existir, realiza o cadastro
      return usuarioModel.cadastrar(nome_completo, email, idade, senha, perfil);
    })
    .then(resultado => {
      if (resultado) {
        res.status(201).json(resultado);
      }
    })
    .catch(erro => {
      console.log("Erro no cadastro de usuário:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}

function autenticar(req, res) {
  var email = req.body.email;
  var senha = req.body.senha;

  if (!email || !senha) {
    res.status(400).send("Email ou senha não fornecidos!");
  } else {
    usuarioModel.autenticar(email, senha)
      .then(resultado => {
        if (resultado.length === 1) {
          res.json(resultado[0]);
        } else if (resultado.length === 0) {
          res.status(403).send("Email ou senha inválidos");
        } else {
          res.status(500).send("Mais de um usuário com as mesmas credenciais");
        }
      })
      .catch(erro => {
        console.log("Erro ao autenticar usuário:", erro.sqlMessage || erro);
        res.status(500).json(erro.sqlMessage || erro);
      });
  }
}

function listar(req, res) {
  usuarioModel.listar()
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao listar usuários:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}

module.exports = {
  cadastrar,
  autenticar,
  listar
};

var usuarioModel = require("../models/usuarioModel");

// Função para cadastrar usuário
function cadastrar(req, res) {
  var nome_completo = req.body.nome_completo;
  var email = req.body.email;
  var idade = req.body.idade;
  var senha = req.body.senha;
  var perfil = req.body.perfil;

  usuarioModel.verificarEmailExistente(email)
    .then(usuarios => {
      if (usuarios.length > 0) {
        return res.status(409).send("E-mail já cadastrado.");
      }
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

// Função para autenticar usuário
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

// Função para listar todos os usuários
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

// Função para pegar distribuição dos perfis de usuários
function pegarDistribuicaoPerfil(req, res) {
  usuarioModel.pegarDistribuicaoPerfil()
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao buscar distribuição dos perfis:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });

}

function salvarRespostasQuiz(req, res) {
  var usuarioId = req.body.usuarioId;
  var pontuacao = req.body.pontuacao;
  var total_perguntas = req.body.total_perguntas;
  var percentual = req.body.percentual;
  var respostas = req.body.respostas; 

  usuarioModel.salvarResultadoQuiz(usuarioId, pontuacao, total_perguntas, percentual)
    .then(resultado => {
      const quizResultadoId = resultado.insertId;

      const promessasRespostas = respostas.map(resposta => {
        return usuarioModel.salvarRespostaQuiz(quizResultadoId, resposta.perguntaId, resposta.resposta);
      });

      return Promise.all(promessasRespostas);
    })
    .then(() => {
      res.status(201).json({ message: "Respostas e resultado salvos com sucesso!" });
    })
    .catch(erro => {
      console.log("Erro ao salvar respostas do quiz:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}

// Função para pegar desempenho dos usuários
function pegarDesempenhoUsuarios(req, res) {
  usuarioModel.pegarDesempenhoUsuarios()
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.log("Erro ao buscar desempenho dos usuários:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}

module.exports = {
  cadastrar,
  autenticar,
  listar,
  salvarRespostasQuiz,
  pegarDistribuicaoPerfil,
  pegarDesempenhoUsuarios,
};

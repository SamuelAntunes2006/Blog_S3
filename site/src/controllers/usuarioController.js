var usuarioModel = require("../models/usuarioModel");
const { executar } = require("../database/config");

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
  const fkusuario_id = req.body.fkusuario_id;
  const acertos = req.body.acertos;
  const totalPerguntas = req.body.totalPerguntas;
  const percentual = req.body.percentual;
  const respostas = req.body.respostas;

  usuarioModel.salvarResultadoQuiz(fkusuario_id, acertos, totalPerguntas, percentual)
  .then(({ insertId }) => {
    console.log("Resultado do quiz salvo, id:", insertId);

    const promessas = respostas.map(({ fkpergunta_id, resposta }) => {
      console.log(`Salvando resposta da pergunta ${fkpergunta_id} como ${resposta}`);
      return usuarioModel.salvarRespostaQuiz(fkusuario_id, fkpergunta_id, resposta);
    });

    return Promise.all(promessas);
  })
  .then(() => {
    console.log("Todas as respostas salvas com sucesso.");
    res.status(201).json({ message: "Respostas e resultado salvos com sucesso!" });
  })
  .catch(erro => {
    console.error("Erro ao salvar respostas do quiz:", erro.sqlMessage || erro);
    res.status(500).json({ error: erro.sqlMessage || erro });
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

function pegarRankingTop3(req, res) {
  console.log("ACESSEI pegarRankingTop3");
  usuarioModel.pegarRankingTop3()
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(erro => {
      console.error("Erro pegarRankingTop3:", erro);
      res.status(500).json({ erro: "Erro ao buscar o ranking." });
    });
}


module.exports = {
  cadastrar,
  autenticar,
  listar,
  salvarRespostasQuiz,
  pegarDistribuicaoPerfil,
  pegarDesempenhoUsuarios,
  pegarRankingTop3
};

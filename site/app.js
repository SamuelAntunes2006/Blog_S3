var ambiente_processo = 'producao';

// var ambiente_processo = 'desenvolvimento';
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env }); // <-- CARREGUE AQUI PRIMEIRO

const { executar } = require("./src/database/config"); // <-- DEPOIS IMPORTE


var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();
app.use(express.static('public'));


var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var avisosRouter = require("./src/routes/avisos");
var medidasRouter = require("./src/routes/medidas");
var aquariosRouter = require("./src/routes/aquarios");
var empresasRouter = require("./src/routes/empresas");

app.get('/api/resultados', (req, res) => {
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

app.get('/api/perguntas', (req, res) => {
    const sql = `SELECT * FROM quiz_pergunta`;

    executar(sql)
        .then(perguntas => res.json(perguntas))
        .catch(err => {
            console.error('Erro ao buscar perguntas:', err);
            res.status(500).send('Erro ao buscar perguntas');
        });
});




app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);

app.use("/usuarios", usuarioRouter);
app.use("/avisos", avisosRouter);
app.use("/medidas", medidasRouter);
app.use("/aquarios", aquariosRouter);


console.log("User:", process.env.DB_USER);
console.log("Senha:", process.env.DB_PASSWORD);

app.post('/api/salvar-respostas-quiz', (req, res) => {
    const { fkusuario_id, acertos, totalPerguntas, percentual } = req.body;

    if (!fkusuario_id || acertos == null || totalPerguntas == null || percentual == null) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }

    const sql = `
        INSERT INTO quiz_resultado (fkusuario_id, pontuacao, total_perguntas, percentual)
        VALUES (${fkusuario_id}, ${acertos}, ${totalPerguntas}, ${percentual});
    `;

    executar(sql)
        .then(() => res.status(201).json({ message: 'Resultado salvo com sucesso!' }))
        .catch(err => {
            console.error('Erro ao salvar resultado:', err);
            res.status(500).json({ error: 'Erro ao salvar resultado' });
        });
});


app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
    
});

var ambiente_processo = 'producao';
// var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require('dotenv').config({ path: caminho_env });

const express = require("express");
const cors = require("cors");
const path = require("path");

const indexRouter = require("./src/routes/index");
const usuarioRouter = require("./src/routes/usuarios");
const perguntasRouter = require("./src/routes/perguntas");

var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/perguntas", perguntasRouter);

if (ambiente_processo === 'desenvolvimento') {
    console.log("User:", process.env.DB_USER);
    console.log("Senha:", process.env.DB_PASSWORD);
}

app.listen(PORTA_APP, () => {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  

    Servidor rodando: http://${HOST_APP}:${PORTA_APP}
    Ambiente: ${process.env.AMBIENTE_PROCESSO}
    `);
});

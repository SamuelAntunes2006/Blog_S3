const mysql = require('mysql2');
require('dotenv').config();

const mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao, params = []) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE NÃO FOI DEFINIDO\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO");
    }

    return new Promise((resolve, reject) => {
        const conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();

        conexao.query(instrucao, params, (erro, resultados) => {
            conexao.end();
            if (erro) {
                reject(erro);
            } else {
                resolve(resultados);
            }
        });

        conexao.on('error', erro => {
            console.error("ERRO NO MySQL SERVER: ", erro.sqlMessage);
        });
    });
}

module.exports = { executar };

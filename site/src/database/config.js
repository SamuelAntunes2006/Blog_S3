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
    return new Promise((resolve, reject) => {
        // Cria a conexão
        const conexao = mysql.createConnection(mySqlConfig);

        // Conecta ao banco
        conexao.connect((err) => {
            if (err) {
                console.error("Erro ao conectar ao banco:", err);
                return reject(err);
            }

            // Executa a query parametrizada
            conexao.query(instrucao, params, (erro, resultados) => {
                // Fecha a conexão assim que terminar
                conexao.end();

                if (erro) {
                    console.error("Erro na query:", erro);
                    return reject(erro);
                }

                // 'resultados' pode ser:
                // - um array para SELECT
                // - um objeto para INSERT/UPDATE/DELETE, contendo insertId, affectedRows etc.
                resolve(resultados);
            });
        });

        // Tratamento de erro na conexão
        conexao.on('error', (erro) => {
            console.error("Erro na conexão MySQL:", erro);
            reject(erro);
        });
    });
}

module.exports = { executar };

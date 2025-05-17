var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL");
    var instrucaoSql = `
        SELECT id, nome_completo, email, perfil_de_investidor 
        FROM cadastro_usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome_completo, email, idade, senha, perfil_de_investidor) {
    console.log("ACESSEI O USUARIO MODEL - cadastrar");
    var instrucaoSql = `
        INSERT INTO cadastro_usuario (nome_completo, email, idade, senha, perfil_de_investidor)
        VALUES ('${nome_completo}', '${email}', ${idade}, '${senha}', '${perfil_de_investidor}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};

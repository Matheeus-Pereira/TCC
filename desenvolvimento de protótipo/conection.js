const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'prototipo'
})

connection.connect(err => {
    if (err) {
        console.log("erro ao acessar banco:", err);
        return;
    }
    console.log('conectado  ao banco!')
}

);

function createTabela(nometb ) {
    const sql = `create table ${nometb} (
    id int auto_increment primary key, 
    nome varchar(255),
    descricao text,
    qtd_estoque int
    )`;
    connection.query(sql,(err, results) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            return;
        }
        console.log('Produto inserido com sucesso, ID:', results.insertId);
    });
}

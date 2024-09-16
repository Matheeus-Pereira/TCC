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

function searchEstoque() {
    const sql = `select * from estoques`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao pesquisar:', err);
            return;
        }
        results.forEach(estoque => {
            console.log(`ID:${estoque.id}, nome:${estoque.nome}, descrição:${estoque.descricao}`);
        })
    });
}
function retiraItem(nm, qt, estoque) {
    const sql = `update produtos set quantidade = quantidade-${qt} where id = '${nm}' and id_estoque=${estoque};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('erro ao movem o item do armazem ', estoque);
            return;
        }
        console.log(result);
    })
}
function addItem(nm, qt, estoque) {
    const sql = `update produtos set quantidade = quantidade+${qt} where id = '${nm}' and id_estoque=${estoque};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('erro ao movem o item do armazem ', estoque);
            return;
        }
        console.log(result);
    })

}


function transfItem(idA, origem, destino, quant) {

  
}



retiraItem('03110462', 1, 1);
addItem('03110462', 5, 1);
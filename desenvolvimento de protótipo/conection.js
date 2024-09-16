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

function transfItem(idA, origem, destino, quant) {

    const sqlorigem = `select quantidade from produtos where id=${idA} and id_estoque=${origem}`;

    connection.query(sqlorigem, (err, results) => {
        if (err) {
            console.log('erro ao encontrar produto', err);
            return;
        }
        if (results.length === 0 || results[0].quantidade < quant) {
            console.log('Não existe saldo suficiente do item ', idA);
            return;
        }
    })
    const sqltransf = `update produtos set quantidade = quantidade-${quant} where id=${idA} and id_estoque=${origem}`;

    connection.query(sqltransf, (err, results) => {
        if (err) {
            console.log("erro ao transferir:", err);
            return;
        }
        const sqlVerificaDestino = `SELECT quantidade FROM produtos WHERE id= ${idA} AND id_estoque= ${destino}`;
        connection.query(sqlVerificaDestino, (err, results) => {
            if (err) {
                console.log('Erro ao verificar o estoque de destino:', err);
                return;
            }
            if (results.length === 0) {
                const insereDestino = `insert into produtos (id, id_estoque, quantidade)
                values ('${idA}', ${destino}, ${quant})`;
                connection.query(insereDestino, (err, results) => {
                    if (err) {
                        console.log("erro ao inserir item");
                        return;
                    }
                    console.log('item ', idA, ' transferido');
                })
            } else {
                // Se o item já existe no destino, atualiza a quantidade
                const sqlAdicionaDestino = `UPDATE produtos SET quantidade = quantidade + ${quant} WHERE id='${idA}' AND id_estoque=${destino}`;
                connection.query(sqlAdicionaDestino, (err, results) => {
                    if (err) {
                        console.log('Erro ao adicionar quantidade ao estoque de destino:', err);
                        return;
                    }
                    console.log('Item transferido com sucesso para o estoque de destino!');
                });
            }
        });
    })
}


transfItem('03110462',1, 10, 1);
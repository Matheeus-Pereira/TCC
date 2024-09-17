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

function confereItem(estoque, id) {
    const sql = `select quantidade from produtos where id_estoque=${estoque} and id='${id}';`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("erro ao pesquisar item");
            return;
        }
        const quant = result[0].quantidade
        return quant;
    })
}

function transfItem(idA, origem, destino, quant) {
    if (confereItem(origem, idA) === 0) {
        console.log('O saldo do item está zerado')
    } else if (confereItem(origem, idA) < quant) {
        console.log('o saldo é menor que a quantidade transferida');
    }

}


// transferir item 03110462 do deposito 1 para o 10
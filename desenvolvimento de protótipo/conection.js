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
    const sql = `select quantidade from produtos where id_estoque=${estoque} and id=${id};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("erro ao pesquisar item", err);
            return;
        }
        const quant = result[0].quantidade
        return quant;
    })
}
function nomeItem(id, callback) {
    const sql = `SELECT nome FROM produtos WHERE id=${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("Erro ao pesquisar item:", err);
            callback(err, null);
            return;
        }
        if (result.length > 0) {
            const nome = result[0].nome;
            callback(null, nome);
        } else {
            callback(null, null); // Nenhum item encontrado
        }
    });
}

function criaItem(id, quantidade, idEstoque) {
    // Obtem o nome do item antes de tentar criar
    nomeItem(id, (err, nome) => {
        if (err || !nome) {
            console.log('Erro ao obter o nome do item ou item não encontrado.');
            return;
        }

        const sql = `INSERT INTO produtos(id, nome, quantidade, id_estoque)
                     VALUES (${id}, '${nome}', ${quantidade}, ${idEstoque})
                     ON DUPLICATE KEY UPDATE id = ${id};`;

        connection.query(sql, (err, result) => {
            if (err) {
                console.log('Erro ao registrar item:', err);
                return;
            }
            console.log('Item criado com sucesso!');
        });
    });
}



function transfItem(idA, origem, destino, quant) {
    if (confereItem(origem, idA) === 0) {
        console.log('O saldo do item está zerado')
        return;
    } else if (confereItem(origem, idA) < quant) {
        console.log('o saldo é menor que a quantidade transferida');
        return;
    } else if (confereItem(destino, idA) === null) {
        criaitem(idA, quant, destino);
    }

}

criaItem('03110462', 1, 2);
// transferir item 03110462 do deposito 1 para o 10
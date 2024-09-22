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

function criaItem(nmr, ida, idb, qtd) {
    // Obtem o nome do item antes de tentar criar


    const sql = `INSERT INTO itensEstoque(nmr, id_estoque, id_prosduto, quantidade)
                     VALUES (${nmr}, '${ida}', ${idb}, ${qtd});`;

    connection.query(sql, (err, result) => {
        if (err) {
            console.log('Erro ao registrar item:', err);
            return;
        }
        console.log('Item criado com sucesso!');
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

// criaItem('03110462', 1, 2);
// transferir item 03110462 do deposito 1 para o 10

function sqlteste() {
    const sql = `insert into itensEstoque(id_estoque, id_produto)
values 
(10, 1);`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(result);
    });
}

sqlteste()
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
            console.log(`ID:${estoque.id}, codigo:${estoque.codigo}, descrição:${estoque.descricao}`);
        })
    });
}//essa função deve ser ajustada
function retiraItem(nm, qt, estoque) {
    const sql = `update itensEstoque set quantidade=quantidade-${qt} where nmr=${nm} and id_estoque=${estoque};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('erro ao movem o item do armazem ', estoque);
            return;
        }
        console.log(result);
    })
}
function addItem(nm, qt, estoque) {
    const sql = `update itensEstoque set quantidade = quantidade+${qt} where nmr=${nm} and id_estoque=${estoque};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('erro ao movem o item do armazem ', estoque);
            return;
        }


        console.log(result);
    })

}

function idEstoque(id) {
    const sql = `select id_produto from itensEstoque where nmr=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('erro', err)
            return
        }
        let nm
        result.forEach(identificacao => {
            nm = identificacao;
        })

        return identificacao;
    })


}

function confereItem(estoque, id) {
    const sql = `select quantidade from itensEstoque where id_estoque=${estoque} and id=${idEstoque(id)};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("erro ao pesquisar item", err);
            return;
        }
        let quant
        result.forEach(quantidade => {
            quant = quantidade
        })


        console.log('quantidade pesquisada', quant)
        return quant;
    })
}

function criaItem(nmr, ida, qtd) {


    const sql = `INSERT INTO itensEstoque(nmr, id_estoque, quantidade)
                     VALUES (${nmr}, '${ida}',  ${qtd});`;

    connection.query(sql, (err, result) => {
        if (err) {
            console.log('Erro ao registrar item:', err);
            return;
        }
        console.log('Item criado com sucesso!');
    });

}



function transfItem(idA, origem, destino, quant) {
    if (confereItem(origem, idA) == 0) {
        console.log('O saldo do item ', idA, ' está zerado')
        return;
    } else if (confereItem(origem, idA) < quant) {
        console.log('o saldo do item ', idA, ' é menor que a quantidade transferida');
        return;
    } else if (confereItem(destino, idA) == null) {
        retiraItem(idA, quant, origem)
        criaItem(idA, destino, quant);
    } else {

        addItem(idA, quant, destino)
        retiraItem(idA, quant, origem)
        console.log('deu certo')
    }

}

transfItem('03110462', 1, 2, 2)

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


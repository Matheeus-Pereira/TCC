const mysql = require('mysql2/promise');
const connection = mysql.createPool(process.env.CONNECTION_STRING)

function searchEstoque() {
    const sql = `select * from estoques`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao pesquisar:', err);
            return;
        }
        if (results.length === 0) {
            console.log('Nenhum estoque encontrado');
            return;
        }
        results.forEach(estoque => {
            console.log(`ID: ${estoque.id}, Código: ${estoque.codigo}, Descrição: ${estoque.descricao}`);
        });
    });
}


async function retiraItem(nm, qt) {


    try {
        const idEst = await idEstoque(nm);
        if (!idEst) {
            console.log('este item não tem estoque #1');
            return;
        }
        const sql = `update itensEstoque set quantidade=quantidade-${qt} where nmr=${nm} and id_estoque=${idEst}`;

        connection.query(sql, (err, result) => {
            if (err) {
                console.log('erro ao mover item #2', err)
                return;
            }
            console.log('item movido', result)
        });
    } catch (error) {
        console.log('erro#3', error);
    }




}


async function addItem(nm, qt) {
    try {
        const idEst = await idEstoque(nm);  // Espera a consulta ao id_estoque
        if (!idEst) {
            console.log('Estoque não encontrado para o item:', nm);
            return;
        }
        const sql = `update itensEstoque set quantidade = quantidade+${qt} where nmr=${nm} and id_estoque=${idEst};`;
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('Erro ao mover o item do armazém', err);
                return;
            }
            console.log('Item adicionado com sucesso:', result);
        });
    } catch (error) {
        console.log('Erro ao adicionar o item:', error);
    }
}



async function idEstoque(numero) {
    return new Promise((resolve, reject) => {
        const sql = `select id from estoques where codigo=${numero};`;
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            const idEstoque = result[0]?.id || null;
            resolve(idEstoque);
        });
    });
}//função zoada


function idProduto(nmr) {

    const sql = `select id from produtos where id = (select id_produto from itensEstoque where nmr=${nmr});`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('erro', err);
            reject(err);
            return;
        }
        console.log('L108', result)
        let valor = result[0].id

        console.log('test', valor)
        return valor;

    });

}

async function confereItem(nmr) {
    try {
        const idEst = 0

        const idProdt = 0
        await idEstoque(nmr).then((item) => { idEst = item });
        await idProduto(nmr).then((item) => { idProdt = item });

        sql = `select quantidade from itensEstoque where id_estoque=${idEst} and id_produto=${idProd};`;

        connection.query(sql, (err, result) => {
            if (err) {
                console.log("erro ao pesquisar item", err);
                return;
            }
            const quantidade = result[0]?.quantidade || 0;
            console.log('quantidade pesquisada', quantidade);
            return quantidade;
        });
    } catch (error) {
        console.log('Erro ao conferir item', error);
    }
}


async function criaItem(numero) {
    await idEstoque(numero).then((idE) => {

        idProduto(numero).then((idP) => {
            const sql = `INSERT INTO itensEstoque(nmr, id_estoque, id_produto)
                     VALUES (${numero}, ${idE},  ${idP});`;

            connection.query(sql, (err, result) => {
                if (err) {
                    console.log('Erro ao registrar item:', err);
                    return;
                }
                console.log('Item criado com sucesso!');
            });
        });
    });




}



async function transfItem(idA, origem, destino, quant) {

    const saldoOrigem = await confereItem(idA); // Espera o saldo do estoque de origem
    if (saldoOrigem === 0) {
        console.log('O saldo do item ', idA, ' está zerado');
        return;
    } else if (saldoOrigem < quant) {
        console.log('O saldo do item ', idA, ' é menor que a quantidade transferida');
        return;
    }

    const saldoDestino = await confereItem(idA); // Verifica o saldo no destino
    if (saldoDestino == null) { // Se o item não existe no destino
        await retiraItem(idA, quant, origem); // Retira do estoque de origem
        await criaItem(idA); // Cria o item no estoque destino
        await addItem(idA, quant, destino); // Adiciona a quantidade no estoque destino
    } else {
        await addItem(idA, quant, destino); // Se já existe, só adiciona a quantidade
        await retiraItem(idA, quant, origem); // E retira do estoque de origem
    }

    console.log('Produto ', idA, ' transferido do estoque ', origem, ' para o estoque ', destino, ' com sucesso\nQuantidade transferida:', quant);



}



//transfItem('03110462', 1, 2, 2)

// criaItem('03110462', 1, 2);
// transferir item 03110462 do deposito 1 para o 10



module.exports = { searchEstoque, transfItem }
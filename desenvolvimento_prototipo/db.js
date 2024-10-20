require('dotenv').config();
const mysql = require('mysql2/promise');

// -------------------------  CONFIGURAÇÃO DO BANCO DE DADOS -------------------------

const connection = mysql.createPool(process.env.CONNECTION_STRING);

// -------------------------  FUNÇÕES DE CONSULTA E MANIPULAÇÃO -------------------------

async function searchEstoque() {
    const sql = `SELECT * FROM estoques`;
    try {
        const [results] = await connection.query(sql);
        if (results.length === 0) {
            console.log('Nenhum estoque encontrado');
            return;
        }
        results.forEach(estoque => {
            console.log(`ID: ${estoque.id}, Código: ${estoque.codigo}, Descrição: ${estoque.descricao}`);
        });
        return results

    } catch (err) {
        console.error('Erro ao pesquisar:', err);
    }
}

async function retiraItem(nm, qt) {
    try {
        const idEst = await idEstoque(nm);
        if (!idEst) {
            console.log('Este item não tem estoque #1');
            return;
        }
        const sql = `UPDATE itensEstoque SET quantidade = quantidade - ${qt} WHERE nmr = ${nm} AND id_estoque = ${idEst}`;
        await connection.query(sql);
        console.log('Item movido');
    } catch (error) {
        console.log('Erro ao mover item #2', error);
    }
}

async function addItem(nm, qt) {
    try {
        const idEst = await idEstoque(nm);
        if (!idEst) {
            console.log('Estoque', idEst, ' não encontrado para o item:', nm);
            return;
        }
        const sql = `UPDATE itensEstoque SET quantidade = quantidade + ${qt} WHERE nmr = ${nm} AND id_estoque = ${idEst}`;
        await connection.query(sql);
        console.log('Item adicionado com sucesso');
    } catch (error) {
        console.log('Erro ao adicionar o item:', error);
    }
}

async function idEstoque(numero) {

    const sql = `SELECT id_estoque FROM itensEstoque WHERE nmr = ${numero}`;
    console.log('encontrando a id do estoque');
    try {
        const [result] = await connection.query(sql)
        return result[0]?.id || null;
    } catch (err) {
        console.error('não consegui enconrtrar o estoque:', err);
        throw err;
    }

}

async function idProduto(nmr) {


    const sql = `SELECT id FROM produtos WHERE codigo=nmr`;
    try {
        const [result] = await connection.query(sql);
        return result[0]?.nmr || null
    } catch (error) {
        console.error('não consegui encontrar o produto')
        throw err;
    }
}


async function confereItem(nmr) {
    try {

        const sql = `select quantidade from itensestoque where id_estoque = (select id_estoque from itensEstoque where nmr = ${nmr}) and id_produto = (select id from produtos where codigo = ${nmr});`;

        const [result] = await connection.query(sql);
        const quantidade = result[0]?.quantidade || 0;
        console.log('Quantidade pesquisada', quantidade);
        return quantidade;
    } catch (error) {
        console.log('Erro ao conferir item', error);
    }
}

async function criaItem(numero) {
    try {
        const idE = await idEstoque(numero);
        const idP = await idProduto(numero);
        const sql = `INSERT INTO itensEstoque (nmr, id_estoque, id_produto) VALUES (${numero}, ${idE}, ${idP})`;
        await connection.query(sql);
        console.log('Item criado com sucesso!');
    } catch (error) {
        console.log('Erro ao registrar item:', error);
    }
}

async function transfItem(idA, origem, destino, quant) {
    const saldoOrigem = await confereItem(idA);
    if (saldoOrigem === 0) {
        console.log('O saldo do item ', idA, ' está zerado');
        return;
    } else if (saldoOrigem < quant) {
        console.log('O saldo do item ', idA, ' é menor que a quantidade transferida');
        return;
    }

    const saldoDestino = await confereItem(idA);
    if (saldoDestino == null) {
        await retiraItem(idA, quant, origem);
        await criaItem(idA);
        await addItem(idA, quant, destino);
    } else {
        await addItem(idA, quant, destino);
        await retiraItem(idA, quant, origem);
    }

    console.log('Produto ', idA, ' transferido do estoque ', origem, ' para o estoque ', destino, ' com sucesso\nQuantidade transferida:', quant);
}

// -------------------------  EXPORTAÇÕES -------------------------
module.exports = { searchEstoque, transfItem };

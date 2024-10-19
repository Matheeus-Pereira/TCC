require('dotenv').config();
const mysql = require('mysql2/promise');
const url = require('url');

// -------------------------  CONFIGURAÇÃO DO BANCO DE DADOS -------------------------
const connectionURL = process.env.CONNECTION_STRING;
const params = url.parse(connectionURL);
const [user, password] = params.auth.split(':');

const connection = mysql.createPool({
    host: params.hostname,
    user: user,
    password: password,
    database: params.pathname.split('/')[1],
    port: params.port,
});

// -------------------------  FUNÇÕES DE CONSULTA E MANIPULAÇÃO -------------------------
function teste() {
    console.log(process.env.CONNECTION_STRING);
}

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
            console.log('Estoque não encontrado para o item:', nm);
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
    return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM estoques WHERE codigo = ${numero}`;
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            const idEstoque = result[0]?.id || null;
            resolve(idEstoque);
        });
    });
}

async function idProduto(nmr) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM produtos WHERE id = (SELECT id_produto FROM itensEstoque WHERE nmr = ${nmr})`;
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('Erro', err);
                reject(err);
                return;
            }
            const valor = result[0]?.id || null;
            resolve(valor);
        });
    });
}

async function confereItem(nmr) {
    try {
        const idEst = await idEstoque(nmr);
        const idProd = await idProduto(nmr);
        const sql = `SELECT quantidade FROM itensEstoque WHERE id_estoque = ${idEst} AND id_produto = ${idProd}`;

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
module.exports = { searchEstoque, transfItem, teste };

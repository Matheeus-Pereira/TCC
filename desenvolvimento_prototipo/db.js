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

async function retiraItem(nm, qt, estoque) {
    try {
        const idEst = await idEstoque(estoque);
        const idProd = await idProduto(nm);
        if (!idEst) {
            console.log('Este item não existe no estoque ', idEst, 'tem estoque #1');
            return;
        }
        const sql = `UPDATE itensEstoque SET quantidade = quantidade - ${qt} WHERE id_produto = ${idProd} AND id_estoque = ${idEst}`;
        await connection.query(sql);
        console.log('Item movido');
    } catch (error) {
        console.log('Erro ao mover item #2', error);
    }
}

async function addItem(nm, qt, estoque) {
    try {
        const idEst = await idEstoque(estoque);
        const idProd = await idProduto(nm)
        if (!idEst) {
            console.log('Id do estoque', estoque, ' não encontrado para o item:', nm, '#30');
            return;
        }
        const sql = `UPDATE itensEstoque SET quantidade = quantidade + ${qt} WHERE id_produto = ${idProd} AND id_estoque = ${idEst}`;
        await connection.query(sql);
        console.log('Item adicionado com sucesso');
    } catch (error) {
        console.log('Erro ao adicionar o item:', error);
    }
}

async function idEstoque(numero) {

    const sql = `select id from estoques where codigo = ${numero};`;//preciso usar o id do estoque
    console.log('encontrando a id do estoque');
    try {
        const [result] = await connection.query(sql)
        return result[0]?.id || null;
    } catch (err) {
        console.error('não consegui encontrar o estoque:', err);
        throw err;
    }

}

async function idProduto(nmr) {

    const sql = `SELECT id FROM produtos WHERE codigo=${nmr}`;
    try {
        const [result] = await connection.query(sql);
        return result[0]?.id || null
    } catch (error) {
        console.error('não consegui encontrar o produto')
        throw err;
    }
}


async function confereItem(nmr, id) {
    try {

        const sql = ` select ie.quantidade 
    from itensEstoque ie
    join produtos p on ie.id_produto = p.id
    join estoques e on ie.id_estoque = e.id
    where e.codigo = ${id} and p.codigo = ${nmr};`;

        const [rows] = await connection.query(sql);
        const quantidade = rows[0].quantidade;
        console.log('Quantidade pesquisada', quantidade, "#202");
        return rows[0]?.quantidade || 0;;
    } catch (error) {
        console.log('Erro ao conferir item #203', error);
    }
}

async function criaItem(numero, estoque) {
    try {
        const idE = await idEstoque(estoque);
        const idP = await idProduto(numero);

        const sql = `INSERT INTO itensEstoque (id_estoque, id_produto) VALUES (${idE}, ${idP})`;
        await connection.query(sql);
        console.log('Item criado com sucesso!');
    } catch (error) {
        console.log('Erro ao registrar item: #20', error);
    }
}

async function transfItem(id, origem, destino, quant) {
    console.log('Transferindo produto ', id, '  do estoque ', origem, ' para o estoque ', destino, '\nQuantidade transferida:', quant);
    const saldoOrigem = await confereItem(id, origem);
    console.log(' quantidade consultada na origem', saldoOrigem)
    if (saldoOrigem === 0) {
        console.log('O saldo do item ', id, ' está zerado #1');
        return;
    } else if (saldoOrigem < quant) {
        console.log('O saldo do item ', id, ' é menor que a quantidaade transferida\n saldo de origem:', saldoOrigem, '\nquantidade transferida:', quant, '#2');
        return;
    }
    console.log('vendo se tem saldo no destino #3')

    const saldoDestino = await confereItem(id, destino);
    const destinoNterior = await confereItem(id, destino);
    console.log('quantidade consultada no destino:', saldoDestino)
    if (!saldoDestino) {
        console.log('\n não tem\n retirando item da origem #4')
        await retiraItem(id, quant, origem);
        console.log('criando relação entre item e destino #5')
        await criaItem(id, destino);
        console.log('adicionando quantidade ao novo destino #6')
        await addItem(id, quant, destino);
    } else {
        console.log('tem saldo\napenas adicionando novo item #7')
        await addItem(id, quant, destino);
        console.log('retirando quantidade da origem')
        await retiraItem(id, quant, origem);
    }

    if (saldoDestino > destinoNterior) {
        console.log('saldo do destino:', saldoDestino, '\nsaldo da origem:', saldoOrigem, 'deve ter funcionado')
    } else {
        console.log('não funcinou, verificar')
    }
    //   console.log('Produto ', id, ' transferido do estoque ', origem, ' para o estoque ', destino, ' com sucesso\nQuantidade transferida:', quant);
}

// -------------------------  EXPORTAÇÕES -------------------------
module.exports = { searchEstoque, transfItem };

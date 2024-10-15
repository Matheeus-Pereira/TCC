const mysql = require('mysql2/promise');
 
const client = mysql.createPool(process.env.CONNECTION_STRING);

async function selectProdutos() {
    const res = await client.query('SELECT * FROM produtos');
    return res[0];
}
 

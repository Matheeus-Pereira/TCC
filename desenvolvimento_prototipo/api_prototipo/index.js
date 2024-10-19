require("dotenv").config();
 
const express = require('express');
const alicacao = express();
const port = process.env.PORT;
const db = require('./db.js');

alicacao.use(express.json());
 
alicacao.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

alicacao.get('/produtos', async (req, res) => {
    const results = await db.selectProdutos();
    res.json(results);
})

//inicia o servidor
alicacao.listen(port);
console.log('API funcionando!');
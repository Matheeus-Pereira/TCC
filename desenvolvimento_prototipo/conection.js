
const express = require('express');
const mysql = require('mysql2/promise')
const { transfItem, searchEstoque } = require('./db.js')

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.json({
    message: 'funcionando'
}))

const connection = mysql.createPool(process.env.CONNECTION_STRING)

// -------------------------  ENDPOINTS -------------------------

app.post('/transfere', async (req, res) => {
    const { idA, origem, destino, quant } = req.body

    if (!idA || !origem || !destino || !quant) {
        return res.status(400).json({ error: 'parametros inválidos' });
    }

    try {
        await transfItem(idA, origem, destino, quant);
        res.status(200).json({ message: 'transferencia realizada com sucesso' });
    } catch (error) {
        console.error('erro ao transferir item:', error)
        res.status(500).json({ error: 'erro ao tranferir item' })
    }

});


app.get('/estoques', async (req, res) => {
    try {
        const sql = 'select * from estoques';
        const [results] = await connection.query(sql);

        if (results.length === 0) {
            return res.status(404).json({ message: 'nenhum estoque encontrado' });
        }

        res.status(200).json(results);

    } catch (error) {
        console.error('erro ao consultar estoques:', error);
        res.status(500).json({ error: 'erro ao consultar estoques' })
    }
})


// -------------------------  INICIA SERVIDOR -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`porta do server:${PORT}`)
});


// app.post('/transferir-item', (req, res) => {
//     const { id, origem, destino, quantidade } = req.body;

//     transfItem(id, origem, destino, quantidade)
//         .then(() => {
//             res.json({ sucess: true, message: 'intem transferido com sucesso!' })
//         })
//         .catch(err => {
//             console.error('erro na transferencia:', err);
//             res.json({ sucess: false, error: err.message });
//         })
// })





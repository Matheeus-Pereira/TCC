require("dotenv").config();

const express = require('express');
const { transfItem } = require('./db.js'); // Importando apenas o que é necessário

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------  MIDDLEWARE -------------------------
app.use(express.json());

// -------------------------  ENDPOINTS -------------------------
app.get('/', (req, res) => res.json({
    message: 'funcionando'
}));

app.post('/transfere', async (req, res) => {
    const { idA, origem, destino, quant } = req.body;

    if (!idA || !origem || !destino || !quant) {
        return res.status(400).json({ error: 'parâmetros inválidos' });
    }

    try {
        await transfItem(idA, origem, destino, quant);
        res.status(200).json({ message: 'transferência realizada com sucesso' });
    } catch (error) {
        console.error('erro ao transferir item:', error);
        res.status(500).json({ error: 'erro ao transferir item' });
    }
});

app.get('/estoques', async (req, res) => {
    console.log('get chamado')
    try {
        const sql = 'SELECT * FROM estoques';
        const [results] = await connection.query(sql);

        if (results.length === 0) {
            return res.status(404).json({ message: 'nenhum estoque encontrado' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('erro ao consultar estoques:', error);
        res.status(500).json({ error: 'erro ao consultar estoques' });
    }
});

// -------------------------  INICIA SERVIDOR -------------------------
app.listen(PORT, () => {
    console.log(`porta do server: ${PORT}`);
});

// -------------------------  CÓDIGO COMENTADO -------------------------
// app.post('/transferir-item', (req, res) => {
//     const { id, origem, destino, quantidade } = req.body;

//     transfItem(id, origem, destino, quantidade)
//         .then(() => {
//             res.json({ success: true, message: 'item transferido com sucesso!' });
//         })
//         .catch(err => {
//             console.error('erro na transferência:', err);
//             res.json({ success: false, error: err.message });
//         });
// });

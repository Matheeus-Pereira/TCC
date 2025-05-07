require("dotenv").config();
import cors from 'cors';

import express, { json } from 'express';
import { transfItem, searchEstoque } from './db.js'; // Importando apenas o que é necessário

const app = express();
const PORT = process.env.PORT || 3000;



// -------------------------  MIDDLEWARE -------------------------
app.use(json());
app.use(cors());
// -------------------------  ENDPOINTS -------------------------
app.get('/', (req, res) => res.json({
    message: 'funcionando'
}));

app.post('/transfere', async (req, res) => {
    const { id, origem, destino, quantidade } = req.body;
    
    if (!id || !origem || !destino || !quantidade) {
        return res.status(400).json({ error: 'parâmetros inválidos' });
    }

    try {
        console.log('entrou no try')
        await transfItem(id, origem, destino, quantidade);
        res.status(200).json({ message: 'transferência realizada com sucesso' });
        console.log('fim do try')
    } catch (error) {
        console.error('erro ao transferir item:', error);
        res.status(500).json({ error: 'erro ao transferir item' });
    }
});

app.get('/estoques', async (req, res) => {
    console.log('get chamado')
    try {

        const result = await searchEstoque();
        res.status(200).json(result);

    } catch (error) {
        console.error('erro ao buscar estoques', error);
        res.status(500).json({ error: 'erro ao acessar os estoques' })
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

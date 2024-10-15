
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res)=>res.json({
    message:'funcionando'
}))



// -------------------------  ENDPOINTS -------------------------

app.post('/transfere:', (req, res)=>{
    const
})


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


// -------------------------  INICIA SERVIDOR -------------------------

app.listen(3000, () => {
    console.log('servidor rodando,porta 3000')
})
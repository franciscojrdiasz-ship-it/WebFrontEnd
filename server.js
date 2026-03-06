const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Configura o Express para servir os arquivos HTML, CSS e JS da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- 1. CONEXÃO COM O MONGODB ---
// Conecta ao MongoDB local.
mongoose.connect('mongodb://127.0.0.1:27017/sistema_financeiro')
    .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// --- 2. MODELO DE DADOS (SCHEMA) ---
// Define como uma "Venda" será salva no banco
const VendaSchema = new mongoose.Schema({
    produto: String,
    regiao: String,
    mes: String,
    valor: Number
});

const Venda = mongoose.model('Venda', VendaSchema);

// --- 3. POPULANDO O BANCO DE DADOS AUTOMATICAMENTE ---
async function popularBanco() {
    const count = await Venda.countDocuments();
    if (count === 0) {
        await Venda.insertMany([
            { produto: 'Servidor Local', regiao: 'Norte', mes: 'Jan', valor: 15000 },
            { produto: 'Licença Antivírus', regiao: 'Sul', mes: 'Jan', valor: 3200 },
            { produto: 'Servidor Local', regiao: 'Sul', mes: 'Fev', valor: 18000 },
            { produto: 'Consultoria Seg', regiao: 'Norte', mes: 'Fev', valor: 8500 },
            { produto: 'Licença Antivírus', regiao: 'Norte', mes: 'Mar', valor: 4100 },
            { produto: 'Consultoria Seg', regiao: 'Sul', mes: 'Mar', valor: 12000 }
        ]);
        console.log('📊 Dados iniciais de vendas inseridos no banco!');
    }
}
popularBanco();

// --- 4. A NOSSA API (ENDPOINT) ---
app.get('/api/vendas', async (req, res) => {
    const { regiao, produto } = req.query;

    // Constrói o filtro dinamicamente com base no que o usuário escolheu
    let filtro = {};
    if (regiao && regiao !== 'Todas') filtro.regiao = regiao;
    if (produto && produto !== 'Todos') filtro.produto = produto;

    try {
        // Agrupa as vendas por mês e soma o valor total
        const resultados = await Venda.aggregate([
            { $match: filtro },
            { $group: { _id: "$mes", totalValor: { $sum: "$valor" } } }
        ]);

        // Ordena os meses corretamente
        const ordemMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        resultados.sort((a, b) => ordemMeses.indexOf(a._id) - ordemMeses.indexOf(b._id));

        // Formata para o Chart.js
        const labels = resultados.map(item => item._id);
        const data = resultados.map(item => item.totalValor);

        res.json({ labels, data });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar dados financeiros' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
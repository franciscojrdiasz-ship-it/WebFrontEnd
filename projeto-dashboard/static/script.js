let meuGrafico; // Variável global para guardar o gráfico

async function carregarDados() {
    // Pega os valores selecionados nos filtros
    const regiao = document.getElementById('regiao').value;
    const produto = document.getElementById('produto').value;

    // Faz o pedido para a nossa API em Python
    const url = `/api/vendas?regiao=${regiao}&produto=${produto}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    desenharGrafico(dados.labels, dados.data);
}

function desenharGrafico(labels, dadosValores) {
    const ctx = document.getElementById('vendasChart').getContext('2d');

    // Se já existe um gráfico na tela, nós o destruímos antes de desenhar o novo (para os filtros funcionarem)
    if (meuGrafico) {
        meuGrafico.destroy();
    }

    // Configuração do Chart.js
    meuGrafico = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: labels, // Ex: ['Jan', 'Fev', 'Mar']
            datasets: [{
                label: 'Faturamento Total (R$)',
                data: dadosValores, // Ex: [4500, 3200, 5000]
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Botão de filtrar
document.getElementById('btn-filtrar').addEventListener('click', carregarDados);

// Carrega o gráfico com "Todos" assim que a página abre
window.onload = carregarDados;
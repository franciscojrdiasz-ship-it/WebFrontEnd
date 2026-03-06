let meuGrafico;

async function carregarDados() {
    const regiao = document.getElementById('regiao').value;
    const produto = document.getElementById('produto').value;

    try {
        // Busca os dados na nossa API Node.js
        const resposta = await fetch(`/api/vendas?regiao=${regiao}&produto=${produto}`);
        const dados = await resposta.json();
        desenharGrafico(dados.labels, dados.data);
    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

function desenharGrafico(labels, dadosValores) {
    const ctx = document.getElementById('vendasChart').getContext('2d');

    if (meuGrafico) {
        meuGrafico.destroy();
    }

    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Faturamento Total (R$)',
                data: dadosValores,
                backgroundColor: '#00d2ff',
                borderColor: '#00a8cc',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

document.getElementById('btn-filtrar').addEventListener('click', carregarDados);
window.onload = carregarDados;
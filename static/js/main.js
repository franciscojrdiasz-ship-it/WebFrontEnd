// Variável global para guardar os produtos carregados da API
let produtosGlobais = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    atualizarContadorCarrinho();
});

// 1. Carrega os produtos e formata para Reais (R$)
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        produtosGlobais = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        produtosGlobais.forEach(produto => {
            // Formata o valor para R$ (Real Brasileiro)
            const precoBRL = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(produto.price);

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${produto.image}" alt="${produto.title}">
                <h3>${produto.title.substring(0, 30)}...</h3>
                <p class="price">${precoBRL}</p>
                <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
            `;
            productList.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// 2. Envia o produto para o Backend (MongoDB)
async function adicionarAoCarrinho(id) {
    const produto = produtosGlobais.find(p => p.id === id);
    if (!produto) return;

    try {
        const resposta = await fetch('/api/carrinho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (resposta.ok) {
            mostrarToast(`Adicionado: ${produto.title.substring(0, 15)}...`);
            atualizarContadorCarrinho();
        }
    } catch (erro) {
        console.error("Erro ao adicionar ao carrinho:", erro);
    }
}

// 3. Atualiza o número de itens somando as quantidades
async function atualizarContadorCarrinho() {
    try {
        const resposta = await fetch('/api/carrinho');
        const itens = await resposta.json();

        // Soma as quantidades em vez de contar apenas as linhas
        const totalItens = itens.reduce((acumulador, item) => acumulador + (item.quantidade || 1), 0);

        document.getElementById('cart-count').innerText = totalItens;
    } catch (erro) {
        console.error("Erro ao atualizar contador:", erro);
    }
}

// 4. Finaliza a compra (Envia do Mongo para o SQL)
async function finalizarCompra() {
    try {
        const resposta = await fetch('/api/checkout', { method: 'POST' });
        const resultado = await resposta.json();

        if (resposta.ok) {
            mostrarToast("Compra finalizada com sucesso!");
            atualizarContadorCarrinho(); // Zera o contador na tela
        } else {
            alert(resultado.erro);
        }
    } catch (erro) {
        console.error("Erro ao finalizar compra:", erro);
    }
}

// 5. Mostra a notificação bonita no canto da tela
function mostrarToast(mensagem) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = mensagem;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
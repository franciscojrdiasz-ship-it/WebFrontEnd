// 1. Nosso Banco de Dados Simulado
const receitas = [
    { id: 1, titulo: "Bolo de Cenoura com Chocolate", categoria: "Sobremesa", tempo: "45 min", ingredientes: "cenoura, ovos, óleo, açúcar, farinha, chocolate", emoji: "🥕" },
    { id: 2, titulo: "Lasanha à Bolonhesa", categoria: "Prato Principal", tempo: "60 min", ingredientes: "massa, carne moída, molho de tomate, queijo, presunto", emoji: "🍝" },
    { id: 3, titulo: "Hambúrguer Artesanal", categoria: "Lanche", tempo: "30 min", ingredientes: "pão, carne, queijo cheddar, alface, tomate, bacon", emoji: "🍔" },
    { id: 4, titulo: "Salmão Grelhado com Legumes", categoria: "Prato Principal", tempo: "25 min", ingredientes: "salmão, azeite, brócolis, cenoura, sal", emoji: "🐟" },
    { id: 5, titulo: "Brownie Cremoso", categoria: "Sobremesa", tempo: "40 min", ingredientes: "chocolate, manteiga, ovos, açúcar, farinha", emoji: "🍫" },
    { id: 6, titulo: "Sanduíche Natural de Frango", categoria: "Lanche", tempo: "15 min", ingredientes: "pão de forma, frango desfiado, maionese, cenoura, milho", emoji: "🥪" }
];

// Capturando elementos
const containerReceitas = document.getElementById("recipes-container");
const inputBusca = document.getElementById("search-input");
const botoesFiltro = document.querySelectorAll(".filter-btn");
const msgSemResultados = document.getElementById("no-results");

// --- NOVO: Carrega os favoritos salvos no navegador (ou cria uma lista vazia) ---
let receitasFavoritas = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

// 2. Função para desenhar as receitas na tela
function renderizarReceitas(listaDeReceitas) {
    containerReceitas.innerHTML = "";

    if (listaDeReceitas.length === 0) {
        msgSemResultados.classList.remove("hidden");
    } else {
        msgSemResultados.classList.add("hidden");

        listaDeReceitas.forEach(receita => {
            // Verifica se o ID desta receita está na nossa lista de favoritos
            const isFavorito = receitasFavoritas.includes(receita.id);
            const iconeCoracao = isFavorito ? "❤️" : "🤍";
            const classeFavorito = isFavorito ? "favoritado" : "";

            const cardHTML = `
                <div class="recipe-card">
                    <button class="favorite-btn ${classeFavorito}" onclick="toggleFavorito(${receita.id})">${iconeCoracao}</button>
                    <div class="recipe-img">${receita.emoji}</div>
                    <div class="recipe-info">
                        <span class="recipe-category">${receita.categoria}</span>
                        <h3 class="recipe-title">${receita.titulo}</h3>
                        <p class="recipe-time">⏳ ${receita.tempo}</p>
                        <button class="recipe-btn">Ver Receita</button>
                    </div>
                </div>
            `;
            containerReceitas.innerHTML += cardHTML;
        });
    }
}

// --- NOVO: Função para adicionar/remover dos favoritos ---
window.toggleFavorito = function(idDaReceita) {
    // Se a receita já está nos favoritos, nós a removemos (filter).
    if (receitasFavoritas.includes(idDaReceita)) {
        receitasFavoritas = receitasFavoritas.filter(id => id !== idDaReceita);
    } else {
        // Se não está, nós adicionamos (push).
        receitasFavoritas.push(idDaReceita);
    }

    // Salva a lista atualizada de volta no armazenamento do navegador
    localStorage.setItem("meusFavoritos", JSON.stringify(receitasFavoritas));

    // Atualiza a tela para os corações mudarem de cor imediatamente
    atualizarTela();
}

// 3. Controlador Mestre de Busca e Filtros
function atualizarTela() {
    const termoBuscado = inputBusca.value.toLowerCase();
    const abaAtiva = document.querySelector(".filter-btn.active").getAttribute("data-categoria");

    let listaFiltrada = receitas;

    // Primeiro, aplica o filtro dos botões
    if (abaAtiva === "Favoritos") {
        // Mostra APENAS as receitas cujo ID está no nosso array de favoritos
        listaFiltrada = listaFiltrada.filter(receita => receitasFavoritas.includes(receita.id));
    } else if (abaAtiva !== "Todas") {
        listaFiltrada = listaFiltrada.filter(receita => receita.categoria === abaAtiva);
    }

    // Depois, aplica o filtro da barra de pesquisa por cima
    if (termoBuscado !== "") {
        listaFiltrada = listaFiltrada.filter(receita =>
            receita.titulo.toLowerCase().includes(termoBuscado) ||
            receita.ingredientes.toLowerCase().includes(termoBuscado)
        );
    }

    renderizarReceitas(listaFiltrada);
}

// Escutadores de Eventos (Listeners)
inputBusca.addEventListener("input", function() {
    // Se o usuário começar a digitar, muda o filtro de volta para "Todas"
    if (inputBusca.value !== "") {
        botoesFiltro.forEach(btn => btn.classList.remove("active"));
        botoesFiltro[0].classList.add("active"); // O botão "Todas"
    }
    atualizarTela();
});

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", function() {
        botoesFiltro.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        inputBusca.value = ""; // Limpa a barra de busca ao trocar de aba
        atualizarTela();
    });
});

// Inicializa o site na primeira vez que abre
atualizarTela();
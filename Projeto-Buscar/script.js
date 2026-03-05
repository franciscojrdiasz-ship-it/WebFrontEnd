// 1. Nosso "Banco de Dados" simulado de Receitas
const receitas = [
    {
        id: 1,
        titulo: "Bolo de Cenoura com Chocolate",
        categoria: "Sobremesa",
        tempo: "45 min",
        ingredientes: "cenoura, ovos, óleo, açúcar, farinha, chocolate",
        emoji: "🥕"
    },
    {
        id: 2,
        titulo: "Lasanha à Bolonhesa",
        categoria: "Prato Principal",
        tempo: "60 min",
        ingredientes: "massa, carne moída, molho de tomate, queijo, presunto",
        emoji: "🍝"
    },
    {
        id: 3,
        titulo: "Hambúrguer Artesanal",
        categoria: "Lanche",
        tempo: "30 min",
        ingredientes: "pão, carne, queijo cheddar, alface, tomate, bacon",
        emoji: "🍔"
    },
    {
        id: 4,
        titulo: "Salmão Grelhado com Legumes",
        categoria: "Prato Principal",
        tempo: "25 min",
        ingredientes: "salmão, azeite, brócolis, cenoura, sal",
        emoji: "🐟"
    },
    {
        id: 5,
        titulo: "Brownie Cremoso",
        categoria: "Sobremesa",
        tempo: "40 min",
        ingredientes: "chocolate, manteiga, ovos, açúcar, farinha",
        emoji: "🍫"
    },
    {
        id: 6,
        titulo: "Sanduíche Natural de Frango",
        categoria: "Lanche",
        tempo: "15 min",
        ingredientes: "pão de forma, frango desfiado, maionese, cenoura, milho",
        emoji: "🥪"
    }
];

// Capturando elementos da tela
const containerReceitas = document.getElementById("recipes-container");
const inputBusca = document.getElementById("search-input");
const botoesFiltro = document.querySelectorAll(".filter-btn");
const msgSemResultados = document.getElementById("no-results");

// 2. Função para desenhar as receitas na tela
function renderizarReceitas(listaDeReceitas) {
    // Limpa o container antes de desenhar
    containerReceitas.innerHTML = "";

    // Se a lista estiver vazia, mostra a mensagem de erro
    if (listaDeReceitas.length === 0) {
        msgSemResultados.classList.remove("hidden");
    } else {
        msgSemResultados.classList.add("hidden");

        // Para cada receita na lista, cria o HTML (o "Card")
        listaDeReceitas.forEach(receita => {
            const cardHTML = `
                <div class="recipe-card">
                    <div class="recipe-img">${receita.emoji}</div>
                    <div class="recipe-info">
                        <span class="recipe-category">${receita.categoria}</span>
                        <h3 class="recipe-title">${receita.titulo}</h3>
                        <p class="recipe-time">⏳ ${receita.tempo}</p>
                        <button class="recipe-btn">Ver Receita</button>
                    </div>
                </div>
            `;
            // Adiciona o card gerado dentro do container
            containerReceitas.innerHTML += cardHTML;
        });
    }
}

// 3. Sistema de Busca por Texto (Título ou Ingrediente)
inputBusca.addEventListener("input", function() {
    const termoBuscado = inputBusca.value.toLowerCase(); // Tudo minúsculo para facilitar

    // Tira a seleção visual dos botões de categoria se o usuário começar a digitar
    botoesFiltro.forEach(btn => btn.classList.remove("active"));
    botoesFiltro[0].classList.add("active"); // Volta pro "Todas"

    const receitasFiltradas = receitas.filter(receita => {
        // Verifica se o texto digitado existe no título OU nos ingredientes
        return receita.titulo.toLowerCase().includes(termoBuscado) ||
               receita.ingredientes.toLowerCase().includes(termoBuscado);
    });

    renderizarReceitas(receitasFiltradas);
});

// 4. Sistema de Filtro por Categoria (Botões)
botoesFiltro.forEach(botao => {
    botao.addEventListener("click", function() {
        // Remove a classe 'active' de todos os botões e adiciona só no que foi clicado
        botoesFiltro.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        // Limpa a barra de pesquisa
        inputBusca.value = "";

        // Pega qual categoria o botão representa (ex: "Sobremesa")
        const categoriaEscolhida = this.getAttribute("data-categoria");

        if (categoriaEscolhida === "Todas") {
            renderizarReceitas(receitas); // Mostra tudo
        } else {
            // Filtra só as receitas daquela categoria
            const receitasFiltradas = receitas.filter(receita => receita.categoria === categoriaEscolhida);
            renderizarReceitas(receitasFiltradas);
        }
    });
});

// Inicia o site mostrando todas as receitas
renderizarReceitas(receitas);
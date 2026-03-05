const images = document.querySelectorAll('.gallery-img');
const imagesArray = Array.from(images);
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const imageCounter = document.getElementById('image-counter');
const downloadBtn = document.getElementById('download-btn');

let currentIndex = 0; 

// --- ATUALIZAÇÃO DA TELA DO MODAL ---
function updateModalContent() {
    const img = imagesArray[currentIndex];
    const highResUrl = img.getAttribute('data-highres');
    
    modalImg.src = highResUrl;
    captionText.innerText = img.alt;
    imageCounter.innerText = `${currentIndex + 1} / ${imagesArray.length}`;

    // Apenas guardamos o link no botão, a mágica do download acontece no evento abaixo
    downloadBtn.href = highResUrl;
}

// --- ABRIR MODAL ---
imagesArray.forEach((img, index) => {
    img.addEventListener('click', function() {
        currentIndex = index;
        updateModalContent();
        modal.classList.remove('hidden');
    });
});

// --- LÓGICA DE NAVEGAÇÃO ---
function showNextImage() {
    currentIndex = (currentIndex === imagesArray.length - 1) ? 0 : currentIndex + 1;
    updateModalContent();
}

function showPrevImage() {
    currentIndex = (currentIndex === 0) ? imagesArray.length - 1 : currentIndex - 1;
    updateModalContent();
}

// Cliques nos botões de seta
nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showNextImage();
});

prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showPrevImage();
});

// --- LÓGICA DE FECHAMENTO ---
closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', function(evento) {
    if (evento.target === modal) {
        modal.classList.add('hidden');
    }
});

// --- ACESSIBILIDADE E TECLADO ---
document.addEventListener('keydown', function(evento) {
    if (!modal.classList.contains('hidden')) {
        if (evento.key === "Escape") modal.classList.add('hidden');
        if (evento.key === "ArrowRight") showNextImage();
        if (evento.key === "ArrowLeft") showPrevImage();
    }
});

// ==========================================
// 🚀 CORREÇÃO DO SISTEMA DE TRANSFERÊNCIA
// ==========================================
downloadBtn.addEventListener('click', async function(evento) {
    // 1. Impede o comportamento padrão de abrir a imagem noutra página!
    evento.preventDefault();

    // Altera o texto para dar feedback visual de que está carregando
    const textoOriginal = downloadBtn.innerText;
    downloadBtn.innerText = "⏳ A transferir...";

    try {
        // 2. Busca a imagem real "por trás dos panos" (Fetch API)
        const resposta = await fetch(modalImg.src);
        const blob = await resposta.blob(); // Converte a resposta num arquivo bruto (Blob)

        // 3. Cria um link temporário invisível no navegador
        const urlTemporaria = window.URL.createObjectURL(blob);
        const linkInvisivel = document.createElement('a');
        linkInvisivel.style.display = 'none';
        linkInvisivel.href = urlTemporaria;

        // Define o nome que o arquivo terá quando for salvo no computador
        linkInvisivel.download = `imagem_galeria_${currentIndex + 1}.jpg`;

        // 4. Adiciona o link, clica nele automaticamente e limpa tudo
        document.body.appendChild(linkInvisivel);
        linkInvisivel.click();

        // Limpeza de memória
        window.URL.revokeObjectURL(urlTemporaria);
        document.body.removeChild(linkInvisivel);

    } catch (erro) {
        console.error("Erro ao tentar transferir a imagem:", erro);
        // Fallback: Se der algum erro (ex: servidor bloqueou), ele abre a imagem numa NOVA aba.
        window.open(modalImg.src, '_blank');
    } finally {
        // Volta o botão ao normal, dando certo ou errado
        downloadBtn.innerText = textoOriginal;
    }
});

// FUTURA ATUALIZAÇÃO: Suporte a "Swipe" (arrastar) no celular.
// Será necessário adicionar escutadores para os eventos 'touchstart', 'touchmove' e 'touchend'
// no elemento do modal para calcular se o dedo do usuário foi da esquerda pra direita ou vice-versa.
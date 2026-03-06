const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const imageCounter = document.getElementById('image-counter');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const fileInput = document.getElementById('file-input');

let imagesArray = [];
let currentIndex = 0;

// Atualiza a lista sempre que uma nova imagem entra
function refreshImagesArray() {
    const imgs = document.querySelectorAll('.gallery-img');
    imagesArray = Array.from(imgs);
}
refreshImagesArray();

// --- UPLOAD DIRETO NA GALERIA ---
fileInput.addEventListener('change', function(evento) {
    const files = Array.from(evento.target.files);

    if (files.length > 0) {
        files.forEach(file => {
            const fileUrl = URL.createObjectURL(file);

            const novaImg = document.createElement('img');
            novaImg.src = fileUrl;
            novaImg.setAttribute('data-highres', fileUrl);
            novaImg.alt = file.name;
            novaImg.classList.add('gallery-img');

            galleryContainer.appendChild(novaImg);
        });

        refreshImagesArray();
        fileInput.value = ''; // Reseta o botão de arquivos
    }
});

// --- ABRIR MODAL ---
galleryContainer.addEventListener('click', function(evento) {
    if (evento.target.classList.contains('gallery-img')) {
        currentIndex = imagesArray.indexOf(evento.target);
        updateModalContent();
        modal.classList.remove('hidden');
    }
});

function updateModalContent() {
    const img = imagesArray[currentIndex];
    const highResUrl = img.getAttribute('data-highres');

    modalImg.src = highResUrl;
    captionText.innerText = img.alt || 'Imagem sem título';
    imageCounter.innerText = `${currentIndex + 1} / ${imagesArray.length}`;
    downloadBtn.href = highResUrl;
}

// --- COMPARTILHAMENTO ---
shareBtn.addEventListener('click', async () => {
    const img = imagesArray[currentIndex];
    const highResUrl = img.getAttribute('data-highres');

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Minha Galeria',
                text: `Olha esta imagem incrível: ${img.alt}`,
                url: highResUrl
            });
        } catch (erro) {
            console.log("Compartilhamento cancelado.");
        }
    } else {
        navigator.clipboard.writeText(highResUrl);
        alert("Link copiado para a área de transferência!");
    }
});

// --- DOWNLOAD SEGURO ---
downloadBtn.addEventListener('click', async function(evento) {
    evento.preventDefault();
    const textoOriginal = downloadBtn.innerText;
    downloadBtn.innerText = "⏳ A transferir...";

    try {
        const resposta = await fetch(modalImg.src);
        const blob = await resposta.blob();
        const urlTemporaria = window.URL.createObjectURL(blob);
        const linkInvisivel = document.createElement('a');
        linkInvisivel.style.display = 'none';
        linkInvisivel.href = urlTemporaria;
        linkInvisivel.download = `galeria_${currentIndex + 1}.jpg`;

        document.body.appendChild(linkInvisivel);
        linkInvisivel.click();

        window.URL.revokeObjectURL(urlTemporaria);
        document.body.removeChild(linkInvisivel);
    } catch (erro) {
        window.open(modalImg.src, '_blank');
    } finally {
        downloadBtn.innerText = textoOriginal;
    }
});

// --- NAVEGAÇÃO E FECHAMENTO ---
function showNextImage() {
    currentIndex = (currentIndex === imagesArray.length - 1) ? 0 : currentIndex + 1;
    updateModalContent();
}

function showPrevImage() {
    currentIndex = (currentIndex === 0) ? imagesArray.length - 1 : currentIndex - 1;
    updateModalContent();
}

nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });

closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden')) {
        if (e.key === "Escape") modal.classList.add('hidden');
        if (e.key === "ArrowRight") showNextImage();
        if (e.key === "ArrowLeft") showPrevImage();
    }
});
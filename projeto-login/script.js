// Capturando os elementos do HTML
const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// Expressão regular para validar formato de e-mail
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adicionando um "ouvinte" para quando o botão de Entrar for clicado
form.addEventListener('submit', function(evento) {
    // Impede que a página recarregue automaticamente
    evento.preventDefault();

    let formValido = true;

    // --- 1. Validação do E-mail ---
    if (emailInput.value.trim() === '') {
        mostrarErro(emailInput, emailError, 'O e-mail é obrigatório.');
        formValido = false;
    } else if (!emailRegex.test(emailInput.value)) {
        mostrarErro(emailInput, emailError, 'Digite um formato de e-mail válido.');
        formValido = false;
    } else {
        removerErro(emailInput, emailError);
    }

    // --- 2. Validação da Senha ---
    if (passwordInput.value.trim() === '') {
        mostrarErro(passwordInput, passwordError, 'A senha é obrigatória.');
        formValido = false;
    } else if (passwordInput.value.length < 6) {
        mostrarErro(passwordInput, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
        formValido = false;
    } else {
        removerErro(passwordInput, passwordError);
    }

    // --- 3. Sucesso! ---
    if (formValido) {
        // Aqui, em um projeto real, você enviaria os dados para o back-end
        alert('Dados validados com sucesso! Iniciando sessão...');

        // Limpa os campos após o "login"
        emailInput.value = '';
        passwordInput.value = '';
    }
});

// Funções auxiliares para evitar repetição de código
function mostrarErro(inputElement, errorElement, mensagem) {
    errorElement.innerText = mensagem;
    errorElement.style.display = 'block';
    inputElement.classList.add('input-error');
}

function removerErro(inputElement, errorElement) {
    errorElement.innerText = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove('input-error');
}
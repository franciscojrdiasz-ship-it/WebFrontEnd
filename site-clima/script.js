// Substitua "SUA_CHAVE_AQUI" pela chave que você pegou no site da OpenWeatherMap
const apiKey = "SUA_CHAVE_AQUI";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherData = document.getElementById("weather-data");
const errorMessage = document.getElementById("error-message");

// Função assíncrona que vai buscar os dados na internet
async function getWeather(city) {
    // Montamos a URL da API com a cidade, a chave, unidades em Celsius (metric) e idioma em português (pt_br)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);

        // Se a cidade não existir (Erro 404)
        if (!response.ok) {
            throw new Error("Cidade não encontrada");
        }

        const data = await response.json(); // Converte a resposta para JSON
        showWeatherData(data); // Chama a função para mostrar na tela

    } catch (error) {
        // Esconde os dados e mostra o erro
        weatherData.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }
}

// Função para preencher o HTML com os dados que chegaram da API
function showWeatherData(data) {
    document.getElementById("city-name").innerText = data.name;
    // O Math.round arredonda a temperatura (ex: 25.6 vira 26)
    document.getElementById("temperature").innerText = `${Math.round(data.main.temp)} °C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = data.main.humidity;
    document.getElementById("wind").innerText = data.wind.speed;

    // Mostra a div de dados e esconde a de erro
    weatherData.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

// Adiciona o evento de clique no botão
searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city.trim() !== "") {
        getWeather(city);
    }
});

// Permite buscar apertando "Enter" no teclado
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value;
        if (city.trim() !== "") {
            getWeather(city);
        }
    }
});
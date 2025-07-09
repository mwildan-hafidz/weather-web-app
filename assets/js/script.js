const appData = {
    cities: [],
    weatherData: {},
};

const cityInput = document.querySelector('#city-input');
const searchButton = document.querySelector('#search-button');

const temperature = document.querySelector('#temperature');
const weather = document.querySelector('#weather');

searchButton.addEventListener('click', async function () {
    const city = cityInput.value;
    appData.cities = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
    .then((res) => {
        return res.json();
    });

    const lat = appData.cities[0].lat;
    const lon = appData.cities[0].lon;
    appData.weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then((res) => {
        return res.json();
    });

    const temp = Math.round(appData.weatherData.main.temp);
    const weat = appData.weatherData.weather[0].main;
    temperature.innerHTML = temp;
    weather.innerHTML = weat;
});
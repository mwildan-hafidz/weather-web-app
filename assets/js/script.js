const appData = {
    cities: [],
    weatherData: {},
};

const cityNameInput = document.querySelector('#city-name-input');
const searchButton = document.querySelector('#search-button');

const temperature = document.querySelector('#temperature');
const weather = document.querySelector('#weather');
const weatherIcon = document.querySelector('#weather-icon');

searchButton.addEventListener('click', async function () {
    const cityName = cityNameInput.value;
    
    appData.cities = await getCities(cityName);
    appData.weatherData = await getWeatherData(appData.cities[0]);

    render();
});

function getCities(cityName) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
    
    return fetch(url)
        .then((res) => res.json());
}

async function getWeatherData(city) {
    const lat = city.lat;
    const lon = city.lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    return fetch(url)
        .then((res) => res.json());
}

function render() {
    const iconURL = `https://openweathermap.org/img/wn/${appData.weatherData.weather[0].icon}@4x.png`
    const temp = Math.round(appData.weatherData.main.temp);
    const weat = appData.weatherData.weather[0].main;
    weatherIcon.setAttribute('src', iconURL);
    temperature.innerHTML = temp;
    weather.innerHTML = weat;
}
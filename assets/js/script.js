const appData = {
    cities: [],
    weatherData: {},
};

const cityNameInput = document.querySelector('#city-name-input');
const searchButton = document.querySelector('#search-button');
const citiesSelect = document.querySelector('#cities-select');

const cityHeader = document.querySelector('#city-header');
const weatherIcon = document.querySelector('#weather-icon');
const windSpeed = document.querySelector('#wind-speed');
const humidity = document.querySelector('#humidity');
const temperature = document.querySelector('#temperature');
const weather = document.querySelector('#weather');

searchButton.addEventListener('click', async function () {
    const cityName = cityNameInput.value;
    
    appData.cities = await getCities(cityName);
    updateSelection();

    appData.weatherData = await getWeatherData(appData.cities[citiesSelect.value]);
    render();
});

citiesSelect.addEventListener('change', async function () {
    appData.weatherData = await getWeatherData(appData.cities[citiesSelect.value]);
    render();
});

function getCities(cityName) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
    
    return fetch(url)
        .then((res) => res.json());
}

function getWeatherData(city) {
    const lat = city.lat;
    const lon = city.lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    return fetch(url)
        .then((res) => res.json());
}

function render() {
    const iconURL = `https://openweathermap.org/img/wn/${appData.weatherData.weather[0].icon}@4x.png`
    const wind = appData.weatherData.wind.speed;
    const humi = appData.weatherData.main.humidity;
    const temp = Math.round(appData.weatherData.main.temp);
    const weat = appData.weatherData.weather[0].main;

    cityHeader.innerHTML = appData.weatherData.name;
    weatherIcon.setAttribute('src', iconURL);
    windSpeed.innerHTML = wind;
    humidity.innerHTML = humi;
    temperature.innerHTML = temp;
    weather.innerHTML = weat;
}

function updateSelection() {
    let content = '';
    appData.cities.forEach((city, index) => {
        content += `<option value=${index} ${index === 0 ? 'selected' : ''}>${city.state}/${city.name}</option>`
    });
    citiesSelect.innerHTML = content;
}
const instance = {
    cities: [],
    weatherData: {},
    settings: {
        units: 'metric',
    },
};

const cityNameInput = document.querySelector('#city-name-input');
const searchButton = document.querySelector('#search-button');
const citiesSelect = document.querySelector('#cities-select');

const cityHeader = document.querySelector('#city-header');
const weatherIcon = document.querySelector('#weather-icon');
const windSpeed = document.querySelector('#wind-speed');
const windSpeedUnits = document.querySelector('#wind-speed-units');
const humidity = document.querySelector('#humidity');
const temperature = document.querySelector('#temperature');
const temperatureUnits = document.querySelector('#temperature-units');
const weather = document.querySelector('#weather');

const unitsSelect = document.querySelector('#units-select');
const saveSettingsBtn = document.querySelector('#save-settings-btn');

searchButton.addEventListener('click', async function () {
    const cityName = cityNameInput.value;
    if (cityName === '') return;
    
    try {
        instance.cities = await getCities(cityName);
        updateSelection();
    }
    catch (err) {
        console.error(err);
        return;
    }
    
    instance.weatherData = await getWeatherData(instance.cities[citiesSelect.value]);
    render();
});

citiesSelect.addEventListener('change', async function () {
    instance.weatherData = await getWeatherData(instance.cities[citiesSelect.value]);
    render();
});

saveSettingsBtn.addEventListener('click', async function () {
    instance.settings.units = unitsSelect.value;
    
    instance.weatherData = await getWeatherData(instance.cities[citiesSelect.value]);
    render();
});

function getCities(cityName) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
    
    return fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json()
        })
        .then((json) => {
            if (json.length === 0) throw new Error('City not found!', );
            return json;
        })
        .catch((err) => {
            throw err;
        });
}

function getWeatherData(city) {
    const lat = city.lat;
    const lon = city.lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${instance.settings.units}&appid=${apiKey}`;

    return fetch(url)
        .then((res) => res.json());
}

function getWindSpeedUnits(units) {
    switch (units) {
        case 'metric':
            return 'm/s';
        
        case 'standard':
            return 'm/s';
        
        case 'imperial':
            return 'mph';
    
        default:
            throw new Error(`Units '${units}' does not exists!`);
    }
}

function getTemperatureUnits(units) {
    switch (units) {
        case 'metric':
            return '&deg;C';
        
        case 'standard':
            return 'K';
        
        case 'imperial':
            return '&deg;F';
    
        default:
            throw new Error(`Units '${units}' does not exists!`);
    }
}

function updateSelection() {
    let content = '';
    instance.cities.forEach((city, index) => {
        content += `<option value=${index} ${index === 0 ? 'selected' : ''}>${`${city.state ? `${city.state}/` : ''}${city.name}`}</option>`;
    });
    citiesSelect.innerHTML = content;
}

function render() {
    cityHeader.innerHTML = instance.cities[citiesSelect.value].name;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${instance.weatherData.weather[0].icon}@4x.png`);
    windSpeed.innerHTML = instance.weatherData.wind.speed;
    windSpeedUnits.innerHTML = getWindSpeedUnits(instance.settings.units);
    humidity.innerHTML = instance.weatherData.main.humidity;
    temperature.innerHTML = Math.round(instance.weatherData.main.temp);
    temperatureUnits.innerHTML = getTemperatureUnits(instance.settings.units);
    weather.innerHTML = instance.weatherData.weather[0].main;
}
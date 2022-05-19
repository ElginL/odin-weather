import {
    fetchHourlyWeather,
    fetchWeather
} from "./api.js";
import {
    getToday,
    convertTodayToWords
} from "./helper.js";

// Global Variable
const DEGREE_SYMBOL = "\u00B0";

/**
 * Fills up current-temp-container with the required HTML code that presents the currentWeather.
 * @param {String} location
 */
const displayCurrentWeather = async (location) => {
    const weather = await fetchWeather(location);
    const currentTempContainer = document.getElementById("current-temp-container");

    const loc = document.createElement("h3");
    loc.textContent = location;

    const description = document.createElement("h4");
    description.textContent = weather.description;

    const temperature = document.createElement("h2");
    temperature.textContent = `${weather.temp}${DEGREE_SYMBOL}`;

    const highLowContainer = document.createElement("div");
    highLowContainer.classList.add("high-low-container");
    
    const highestTemp = document.createElement("p");
    highestTemp.textContent = `H:${weather.temp_max}${DEGREE_SYMBOL}`;

    const lowestTemp = document.createElement("p");
    lowestTemp.textContent = `L:${weather.temp_min}${DEGREE_SYMBOL}`;

    highLowContainer.append(highestTemp, lowestTemp);

    
    currentTempContainer.append(loc, description, temperature, highLowContainer);
    displayFlag(location);
}

/**
 * Fetches country flag from an API and adds it to current-temp-container.
 * @param {String} country 
 */
const displayFlag = country => {
    const currentTempContainer = document.getElementById("current-temp-container");
    
    const URL = `https://countryflagsapi.com/png/${country}`;
    
    const image = new Image();
    image.src = URL;

    currentTempContainer.appendChild(image);
}

/**
 * Fills up daily-forecast with the required HTML code that presents the daily temperature
 * and weather forecast.
 * @param {String} location 
 */
const displayDailyForecast = async (location) => {
    const weather = await fetchHourlyWeather(location);
    const dailyForecast = weather.daily;
    
    const dailyForecastContainer = document.getElementById("daily-forecast");

    let today = getToday();

    dailyForecast.forEach(data => {
        const max = document.createElement("h3");
        max.textContent = `${data.temp.max}${DEGREE_SYMBOL}`;

        const min = document.createElement("h3");
        min.textContent = `${data.temp.min}${DEGREE_SYMBOL}`;

        const dailyContainer = document.createElement("div");
        dailyContainer.classList.add("daily-container");

        today += 1;
        // Wrap around.
        if (today >= 7) {
            today = 0;
        }

        // Monday, Tuesday, Wednesday, ..., Sunday
        const dayDescription = document.createElement("h2");
        dayDescription.textContent = convertTodayToWords(today);

        const weatherIcon = new Image();
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;       

        dailyContainer.append(dayDescription, max, min, weatherIcon);

        dailyForecastContainer.appendChild(dailyContainer);
    })
}

const displayDetailedCurrentWeather = async (location) => {
    const weather = await fetchWeather(location);

    const extraContainer = document.getElementById("extra-weather-container");
    extraContainer.classList.add("detailed-weather-container");

    const feelsLikeContainer = createContainer("Feels Like", weather.feels_like, DEGREE_SYMBOL, "../images/temperature.png");
    const windSpeedContainer = createContainer("Wind Speed", weather.windSpeed, "km/h", "../images/air.png");
    const humidityContainer = createContainer("Humidity", weather.humidity, "%", "../images/humidity.png");
    const pressureContainer = createContainer("Pressure", weather.pressure, "pa", "../images/pressure.png");

    extraContainer.append(feelsLikeContainer, windSpeedContainer, humidityContainer, pressureContainer);

    // Inner helper function
    function createContainer(description, magnitude, unit, iconSrc) {
        const container = document.createElement("div");
        
        const text = document.createElement("p");
        text.textContent = `${description}: ${magnitude}${unit}`;
        
        const icon = new Image();
        icon.src = iconSrc;

        container.append(text, icon);
        return container;
    }
}

const resetWeathers = () => {
    const currentTempContainer = document.getElementById("current-temp-container");
    const dailyForecast = document.getElementById("daily-forecast");
    const extraWeatherContainer = document.getElementById("extra-weather-container");

    currentTempContainer.innerHTML = '';
    dailyForecast.innerHTML = '';
    extraWeatherContainer.innerHTML = '';
}

const renderWeather = (location) => {
    displayCurrentWeather(location);
    displayDailyForecast(location);
    displayDetailedCurrentWeather(location);
}

export { renderWeather, resetWeathers };
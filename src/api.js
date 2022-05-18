// Global Variables
const API_KEY = "cc85ab120b8aae2730bd321b5fc8ddf3";
let currentWeather = null;
let dailyWeatherForecast = null;

/**
 * Fetches the current weather data using open weather API.
 * @param {String} location 
 * @returns An object containing fields lon, lat, id, main, description, icon, temp,
 *          feels_like, temp_min, temp_max, pressure, humidity.
 */
const fetchWeather = async location => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

    const response = await fetch(URL);
    const data = await response.json();

    currentWeather = {
        ...data.coord,
        ...data.weather[0],
        ...data.main,
        windSpeed: data.wind.speed
    }

    return currentWeather;
}

/**
 * Fetches the forecast of daily weather.
 * @param {String} location 
 * @returns 
 */
const fetchHourlyWeather = async location => {
    currentWeather = await fetchWeather(location);
    
    const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeather.lat}&lon=${currentWeather.lon}&units=metric&appid=${API_KEY}`;

    const response = await fetch(URL);
    const hourlyData = await response.json();

    dailyWeatherForecast = {
        daily: hourlyData.daily.map(x => {
            return {
                temp: x.temp,
                icon: x.weather[0].icon
            }
        })
    };

    return dailyWeatherForecast;
}

export { fetchWeather, fetchHourlyWeather };
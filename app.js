const degreeSymbol = "\u00B0"

const fetchWeather = async location => {
    const API_KEY = "cc85ab120b8aae2730bd321b5fc8ddf3";
    const requestAddress = "https://api.openweathermap.org/data/2.5/weather?q=";
    const URL = `${requestAddress}${location}&appid=${API_KEY}&units=metric`;

    const response = await fetch(URL);
    const data = await response.json();

    return {
        ...data.coord,
        ...data.weather[0],
        ...data.main,
        windSpeed: data.wind.speed
    }
}

const displayCurrentWeather = async (location) => {
    const weather = await fetchWeather(location);
    const currentTempContainer = document.getElementById("current-temp-container");

    const loc = document.createElement("h3");
    loc.textContent = location;

    const description = document.createElement("h4");
    description.textContent = weather.description;

    const temperature = document.createElement("h2");
    temperature.textContent = `${weather.temp}${degreeSymbol}`;

    const highLowContainer = document.createElement("div");
    highLowContainer.classList.add("high-low-container");
    
    const highestTemp = document.createElement("p");
    highestTemp.textContent = `H:${weather.temp_max}${degreeSymbol}`;

    const lowestTemp = document.createElement("p");
    lowestTemp.textContent = `L:${weather.temp_min}${degreeSymbol}`;

    highLowContainer.append(highestTemp, lowestTemp);

    
    currentTempContainer.append(loc, description, temperature, highLowContainer);
    displayFlag(location);
}

const displayFlag = country => {
    const currentTempContainer = document.getElementById("current-temp-container");
    
    const URL = `https://countryflagsapi.com/png/${country}`;

    const image = document.createElement("img");
    image.src = URL;

    currentTempContainer.appendChild(image);
}

const fetchHourlyWeather = async (location) => {
    const weather = await fetchWeather(location);

    const lat = weather["lat"];
    const lon = weather["lon"];
    
    const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=cc85ab120b8aae2730bd321b5fc8ddf3`;

    const response = await fetch(URL);
    const hourlyData = await response.json();

    return {
        daily: hourlyData.daily.map(x => {
            return {
                temp: x.temp,
                icon: x.weather[0].icon
            }
        }),
        hourly: hourlyData.hourly.map(x => x.temp)
    };
}

const getToday = () => {
    const today = new Date();
    const desc = today.getDay();

    return desc;
}

const convertTodayToWords = (day) => {
    switch (day) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Error!";
    }
}

const displayDailyForecast = async (location) => {
    const weather = await fetchHourlyWeather(location);
    const dailyForecast = weather.daily;
    
    const dailyForecastContainer = document.getElementById("daily-forecast");

    let today = getToday();

    dailyForecast.forEach(data => {
        const max = document.createElement("h3");
        max.textContent = `${data.temp.max}${degreeSymbol}`;

        const min = document.createElement("h3");
        min.textContent = `${data.temp.min}${degreeSymbol}`;

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

    const feelsLikeContainer = document.createElement("div");
    const feelsLike = document.createElement("p");
    feelsLike.textContent = `Feels Like: ${weather.feels_like}${degreeSymbol}`;
    const feelsLikeIcon = new Image();
    feelsLikeIcon.src = "./images/temperature.png";
    feelsLikeContainer.append(feelsLike, feelsLikeIcon);

    const windSpeedContainer = document.createElement("div");
    const windSpeed = document.createElement("p");
    windSpeed.textContent = `Wind Speed: ${weather.windSpeed}km/h`;
    const windSpeedIcon = new Image();
    windSpeedIcon.src = "./images/air.png";
    windSpeedContainer.append(windSpeed, windSpeedIcon);

    const humidityContainer = document.createElement("div");
    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${weather.humidity}%`;
    const humidityIcon = new Image();
    humidityIcon.src = "./images/humidity.png";
    humidityContainer.append(humidity, humidityIcon);

    const pressureContainer = document.createElement("div");
    const pressure = document.createElement("p");
    pressure.textContent = `Pressure: ${weather.pressure}pa`;
    const pressureIcon = new Image();
    pressureIcon.src = "./images/pressure.png";
    pressureContainer.append(pressure, pressureIcon);

    extraContainer.append(feelsLikeContainer, windSpeedContainer, humidityContainer, pressureContainer);
}

const searchWeatherForm = document.querySelector(".search-weather-form");

searchWeatherForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = document.getElementById("city-input");

    resetWeathers();

    displayCurrentWeather(input.value);
    displayDailyForecast(input.value);
    displayDetailedCurrentWeather(input.value);

    searchWeatherForm.reset();
})

const resetWeathers = () => {
    const currentTempContainer = document.getElementById("current-temp-container");
    const dailyForecast = document.getElementById("daily-forecast");
    const extraWeatherContainer = document.getElementById("extra-weather-container");

    currentTempContainer.innerHTML = '';
    dailyForecast.innerHTML = '';
    extraWeatherContainer.innerHTML = '';
}

displayCurrentWeather("Japan");
displayDailyForecast("Japan");

displayDetailedCurrentWeather("Japan");
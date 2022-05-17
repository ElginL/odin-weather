
const fetchWeather = async location => {
    const API_KEY = "cc85ab120b8aae2730bd321b5fc8ddf3";
    const requestAddress = "https://api.openweathermap.org/data/2.5/weather?q=";
    const URL = `${requestAddress}${location}&appid=${API_KEY}&units=metric`;

    const response = await fetch(URL);
    const data = await response.json();

    return {
        ...data.weather[0],
        ...data.main
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
    const degreeSymbol = "\u00B0"
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

displayCurrentWeather("malaysia");
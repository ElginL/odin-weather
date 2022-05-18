import {
    renderWeather, 
    resetWeathers
} from "./DOMRender.js";

// Adding event listener to search form in the top navigation bar.
const searchWeatherForm = document.querySelector(".search-weather-form");
searchWeatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("city-input");

    resetWeathers();

    renderWeather(input.value);

    searchWeatherForm.reset();
})

// Initial page render
renderWeather("Singapore");
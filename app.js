const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-button");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "837ec486e44b5bd8d8787cee4573e593";

const createWeatherCard = (cityName, weatherItem, index) => {
  const temperatureCelsius = (weatherItem.main.temp - 273.15).toFixed(2);
  const date = weatherItem.dt_txt.split(" ")[0];

  if (index === 0) {
    return `
      <div class="details">
        <h2>${cityName} (${date})</h2>
        <h4>Temperature: ${temperatureCelsius}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
      </div>
      <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"
          alt="${weatherItem.weather[0].description}">
        <h4>${weatherItem.weather[0].description}</h4>
      </div>
    `;
  } else {
    return `
      <li class="card">
        <h3>(${date})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"
          alt="${weatherItem.weather[0].description}">
        <h4>Temperature: ${temperatureCelsius}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
      </li>
    `;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(weatherApiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        }
      });
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching the weather forecast. Please try again later.");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(geocodingApiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (!data.length) {
        return alert(`No coordinates found for ${cityName}`);
      }

      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(error => {
      console.error("Error fetching city coordinates:", error);
      alert("An error occurred while fetching the coordinates. Please try again later.");
    });
};

searchButton.addEventListener("click", getCityCoordinates);

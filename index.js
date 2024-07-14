window.onload = function(){

let city_input = document.getElementById("cityInput");
let searchbutton = document.getElementById("searchBtn");
let locationBtn = document.getElementById("locationBtn");

const apiKey = "da602db8f4d5a5a4f321b53792692154";

const currentweatherCard = document.querySelectorAll(".weather-left .card")[0];
const fourDaysForecastCard = document.querySelectorAll(".day-forecast")[0];
const aqiCard = document.querySelectorAll(".highlights .card")[0];
const sunriseCard = document.querySelectorAll(".highlights .card")[1];
const aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
const humidityVal = document.getElementById("humidityval");
const pressureVal = document.getElementById("pressureval");
const visibilityVal = document.getElementById("visibilityval");
const windspeedVal = document.getElementById("windspeedval");
const feelsVal = document.getElementById("feelsval");

const hourlyForecastCard = document.querySelector(".hourly-forecast");

const body = document.body;

function getWeatherData(name, lat, lon, country, state) {
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const AQI_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch AQI Data
  fetch(AQI_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
      aqiCard.innerHTML = `
        <div class="card-head">
          <p>Air Quality Index</p>
          <p class="air-index aqi-${data.list[0].main.aqi}">${
        aqiList[data.list[0].main.aqi - 1]
      }</p>
        </div>
        <div class="air-indices">
          <img class="rotate" src="svg/wind-energy-svgrepo-com.svg" alt="" />
          <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
          <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
          <div class="item"><p>SO2</p><h2>${so2}</h2></div>
          <div class="item"><p>CO</p><h2>${co}</h2></div>
          <div class="item"><p>NO</p><h2>${no}</h2></div>
          <div class="item"><p>NO2<h2>${no2}</h2></div>
          <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
          <div class="item"><p>O3</p><h2>${o3}</h2></div>
        </div>
      `;
    })
    .catch((e) => {
      console.error("Error fetching AQI data:", e);
      alert("Error fetching AQI data");
    });

  // Fetch Current Weather Data
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const weatherCondition = data.weather[0].main.toLowerCase();
      updateBackground(weatherCondition);
      const date = new Date();
      currentweatherCard.innerHTML = `
        <div class="current-weather">
          <div class="details">
            <p>Now</p>
            <h2>${data.main.temp.toFixed(2)}&deg;C</h2>
            <p>${data.weather[0].description}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png" alt=""/>
          </div>
        </div>
        <hr />
        <div class="card-footer">
          <p><i class="fa-regular fa-calendar-days"></i> ${
            days[date.getDay()]
          }, ${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
          <p><i class="fa-solid fa-location-crosshairs"></i> ${name}, ${country}</p>
        </div>
      `;
      let { sunrise, sunset } = data.sys,
        { timezone, visibility } = data,
        { humidity, pressure, feels_like } = data.main,
        { speed } = data.wind;
      let sunriseTime = moment
        .utc(sunrise, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      let sunsetTime = moment
        .utc(sunset, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunriseCard.innerHTML = `
        <div class="card-head">
          <p>Sunrise & Sunset</p>
        </div>
        <div class="sunrise-sunset">
          <div class="item">
            <div class="icon"><img src="svg/sunrise-over-mountains-svgrepo-com.svg" alt="" /></div>
            <div><p>Sunrise</p><h2>${sunriseTime}</h2></div>
          </div>
          <div class="item">
            <div class="icon"><img src="svg/sunset-svgrepo-com.svg" alt="" /></div>
            <div><p>Sunset</p><h2>${sunsetTime}</h2></div>
          </div>
        </div>
      `;
      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure} hPa`;
      visibilityVal.innerHTML = `${(visibility / 1000).toFixed(1)} Km`;
      windspeedVal.innerHTML = `${speed} m/s`;
      feelsVal.innerHTML = `${feels_like.toFixed(2)}&deg;C`;
    })
    .catch((e) => {
      console.error("Error fetching current weather data:", e);
      alert("Error fetching current weather data");
    });

  // Function to update background based on weather condition
  function updateBackground(weatherCondition) {
    let backgroundClass = "";
    switch (weatherCondition) {
      case "clear":
        backgroundClass = "clear-sky";
        break;
      case "clouds":
        backgroundClass = "cloudy";
        break;
      case "rain":
      case "drizzle":
        backgroundClass = "rainy";
        break;
      case "thunderstorm":
        backgroundClass = "thunderstorm";
        break;
      case "snow":
        backgroundClass = "snowy";
        break;
      default:
        backgroundClass = "default";
    }
    // Remove existing background classes and set new one
    body.className = "";
    body.classList.add(backgroundClass);
    document.body.style.backgroundAttachment = 'fixed';
  }

  // Fetch Weather Forecast Data
  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let hourlyForecast = data.list;
      hourlyForecastCard.innerHTML = "";
      for (i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) {
          a = "AM";
        }
        if (hr == 0) {
          hr = 12;
        }
        if (hr > 12) {
          hr -= 12;
        }
        hourlyForecastCard.innerHTML += `
            <div class="card">
              <p>${hr} ${a}</p>
              <img src="https://openweathermap.org/img/wn/${
                hourlyForecast[i].weather[0].icon
              }.png" alt="" />
              <p>${hourlyForecast[i].main.temp.toFixed(2)}&deg;C</p>
            </div>
        `;
      }
      let uniqueForecastDays = [];
      let fourDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
      });

      fourDaysForecastCard.innerHTML = ``;

      for (let i = 1; i < fourDaysForecast.length && i <= 4; i++) {
        let date = new Date(fourDaysForecast[i].dt_txt);
        fourDaysForecastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${
                fourDaysForecast[i].weather[0].icon
              }@2x.png" alt="" />
              <span>${fourDaysForecast[i].main.temp.toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>
        `;
      }
    })
    .catch((e) => {
      console.error("Error fetching weather forecast data:", e);
      alert("Error fetching weather forecast data");
    });
}

function getcity() {
  let city = city_input.value.trim();
  city_input.value = "";
  if (!city) return;
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert("City not found");
        return;
      }
      let { name, lat, lon, country, state } = data[0];
      getWeatherData(name, lat, lon, country, state);
    })
    .catch((e) => {
      console.error("Error fetching city data:", e);
      alert("Error fetching city data");
    });
}

function getUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    let reversed_geocoding_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
    fetch(reversed_geocoding_url)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          alert("Unable to get your location");
          return;
        }
        let { name, country, state } = data[0];
        getWeatherData(name, latitude, longitude, country, state);
      });
  });
}

searchbutton.addEventListener("click", getcity);
locationBtn.addEventListener("click", getUserLocation);
city_input.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getUserLocation()
);
window.addEventListener("load", getUserLocation);
}

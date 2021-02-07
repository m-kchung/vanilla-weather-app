// functions
  // Current DateTime
function formatDate(date) {

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];


  let formattedDate = `${day} ${formathours(date)}`
  return formattedDate;
}

// format hours
function formathours(timestamp) {
  let date = new Date(timestamp);

  let hour = date.getHours();
  if (hour < 10) {
  hour = `0${hour}`
  }
  
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`
  }

  let formattedhour = `${hour}:${minute}`
  return formattedhour;
}

// Get current Position
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

// show position
function showPosition(response) {
  let latitude = response.coords.latitude
  let longitude = response.coords.longitude
  let apiKey = "5a9b3c5051ae04b7172dded8be3de831";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemp);
}


// show today's temperature info
function displayTemp(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  let icon = response.data.weather[0].icon;

  celsiusTemperature= response.data.main.temp;
  feelsLikeTemperature = response.data.main.feels_like


  document.querySelector("#city-heading").innerHTML = `${city}, ${country}`;
  document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#weather-main").innerHTML = response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML= Math.round(response.data.main.humidity);
  document.querySelector("#wind").innerHTML= Math.round(response.data.wind.speed);
  document.querySelector("#feels_like").innerHTML= Math.round(response.data.main.feels_like);
  document.querySelector("#weather-icon").setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
    );
  document.querySelector("#weather-icon").setAttribute(
    "alt",
    response.data.weather[0].description
    )
    document.querySelector("#current-time").innerHTML = formatDate(new Date());

}


// Get forecast
function displayForecast (response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  forecastTemperature= response.data.list
  

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];

    forecastElement.innerHTML +=`
      <div class="col col-formatting">
        <ul>
          <li>
            ${formathours(forecast.dt * 1000)}
          </li>
          <li>
            <img src = "http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="forecast-icons">
          </li>
          <li>
          <span id="forecast-temp">${Math.round(forecast.main.temp)}</span><span id="temp-unit">ºC</span>
          </li>
        </ul>
      </div>
    `;
  }
}


// call today's weather API
function callWeatherApi(city) {
  let cityName = city;
  let apiKey = "5a9b3c5051ae04b7172dded8be3de831";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather"
  let apiUrl = `${apiEndpoint}?q=${cityName}&units=${units}&appid=${apiKey}`;
  
  axios.get(apiUrl).then(displayTemp);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${apiKey}`
  
  axios.get(apiUrl).then(displayForecast);


}


// Update city and acll weather API
function updateCity(event) {
  event.preventDefault();
  let cityName = document.querySelector("#city-name").value;
  if(cityName) {
    callWeatherApi(cityName);
  }
}

// convert the units to Fahrenheit
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let feelsLikeElement = document.querySelector("#feels_like")
  let tempUnit = document.querySelectorAll("#temp-unit");
  let forecastTempElement = document.querySelectorAll("#forecast-temp");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9/5) + 32);
  feelsLikeElement.innerHTML = Math.round((feelsLikeTemperature * 9/5) + 32);


  for (let i=0; i<7; i++) {
  tempUnit[i].innerHTML = "ºF"
}
  // add the active class to the Fahrenheit link
  fahrenheit.classList.remove("btn-outline-secondary");
  fahrenheit.classList.add("btn-secondary");

  // remove the active class from the celsius link
  celsius.classList.remove("btn-secondary")
  celsius.classList.add("btn-outline-secondary")

    for (let i=0; i<5; i++) {
  forecastTempElement[i].innerHTML = Math.round((forecastTemperature[i].main.temp * 9/5) + 32);
}

};


// Temperature - Fahrenheit to Celcsus
function changeToCelsius (event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let feelsLikeElement = document.querySelector("#feels_like");
  let tempUnit = document.querySelectorAll("#temp-unit");
  let forecastTempElement = document.querySelectorAll("#forecast-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  feelsLikeElement.innerHTML = Math.round(feelsLikeTemperature);

  for (let i=0; i<7; i++) {
  tempUnit[i].innerHTML = "ºC"
}

  // remove the active class to the Fahrenheit link
  fahrenheit.classList.remove("btn-secondary");
  fahrenheit.classList.add("btn-outline-secondary");

  // add the active class from the celsius link
  celsius.classList.remove("btn-outline-secondary")
  celsius.classList.add("btn-secondary")

  for (let i=0; i<5; i++) {
  forecastTempElement[i].innerHTML = Math.round(forecastTemperature[i].main.temp);
}


}

// Start
let celsiusTemperature = null;
let feelsLikeTemperature = null;
let forecastTemperature = null;

// call Weather API at the start
callWeatherApi("London");

// change city 
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", updateCity);

// change to Fahrenheit
let fahrenheit = document.querySelector("#convert-to-fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);

  // Change to Celsius
let celsius = document.querySelector("#convert-to-celsius");
celsius.addEventListener("click", changeToCelsius)

// location based weather
let currentlocation = document.querySelector("#location-icon");
currentlocation.addEventListener("click", getCurrentPosition)
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

// call today's weather API
function callWeatherApi(city) {
  let cityName = city;
  let apiKey = "5a9b3c5051ae04b7172dded8be3de831";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather"
  let apiUrl = `${apiEndpoint}?q=${cityName}&units=${units}&appid=${apiKey}`;
  
  axios.get(apiUrl).then(displayTemp);
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
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9/5) + 32);
  feelsLikeElement.innerHTML = Math.round((feelsLikeTemperature * 9/5) + 32);

  for (let i=0; i<2; i++) {
  tempUnit[i].innerHTML = "ºF"
}
  // add the active class to the Fahrenheit link
  fahrenheit.classList.remove("btn-outline-secondary");
  fahrenheit.classList.add("btn-secondary");

  // remove the active class from the celsius link
  celsius.classList.remove("btn-secondary")
  celsius.classList.add("btn-outline-secondary")

};


// Temperature - Fahrenheit to Celcsus
function changeToCelsius (event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  let feelsLikeElement = document.querySelector("#feels_like");
  let tempUnit = document.querySelectorAll("#temp-unit");
  temperature.innerHTML = Math.round(celsiusTemperature);
  feelsLikeElement.innerHTML = Math.round(feelsLikeTemperature);

  for (let i=0; i<2; i++) {
  tempUnit[i].innerHTML = "ºC"
}

  // remove the active class to the Fahrenheit link
  fahrenheit.classList.remove("btn-secondary");
  fahrenheit.classList.add("btn-outline-secondary");

  // add the active class from the celsius link
  celsius.classList.remove("btn-outline-secondary")
  celsius.classList.add("btn-secondary")

}

// Start
let celsiusTemperature = null;
let feelsLikeTemperature = null;

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

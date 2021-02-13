// Date / Time formats
  // shortform days
  function formatShortDays(timestamp) {
    let date = new Date(timestamp);
    let days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thur",
      "Fri",
      "Sat"
    ]
    let day = days[date.getDay()]
    return day;
  }

  // Current DateTime
  function formatDate(date) {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
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

// Current positions - lat/long

  // Get current Position
  function getCurrentPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(showPosition);
  }

  // show position
  function showPosition(response) {
    latitude = response.coords.latitude
    longitude = response.coords.longitude
    
    let units = "metric";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayTemp);
  }

// Call Weather APIs
  // forecast by day - call API
  function forecastbyday (lat, lon) {
    let units ="metric";
    let exclude = "current,minutely,hourly,alerts"
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?"
    let apiUrl =`${apiEndpoint}lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=${units}`
    axios.get(apiUrl).then(forecastDailyTemp);
  }

  // call today's weather API
  function callWeatherApi(city) {
  let cityName = city;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather"
  let apiUrl = `${apiEndpoint}?q=${cityName}&units=${units}&appid=${apiKey}`;
  
  axios.get(apiUrl).then(displayTemp);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${apiKey}`
  
  axios.get(apiUrl).then(displayForecast);
}

// Update city and call weather API
function updateCity(event) {
  event.preventDefault();
  let cityName = document.querySelector("#city-name").value;
  if(cityName) {
    callWeatherApi(cityName);
  }
}

// Use Today's weather info from the API
  // show today's temperature info
  function displayTemp(response) {
    let city = response.data.name;
    let country = response.data.sys.country;
    let icon = response.data.weather[0].icon;
    let iconNumber = Math.round(icon.substring(0,2));
    let background = document.querySelector(".weather-app")
    console.log(iconNumber);
    celsiusTemperature= response.data.main.temp;
    feelsLikeTemperature = response.data.main.feels_like;
    let tempUnit = document.querySelectorAll("#temp-unit");

    document.querySelector("#city-heading").innerHTML = `${city}, ${country}`;
    document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#weather-main").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML= Math.round(response.data.main.humidity);
    document.querySelector("#wind").innerHTML= Math.round(response.data.wind.speed);
    document.querySelector("#feels_like").innerHTML= Math.round(response.data.main.feels_like);
    document.querySelector("#weather-icon").setAttribute(
      "src",
      `images/${icon}.png`
      );
    document.querySelector("#weather-icon").setAttribute(
      "alt",
      response.data.weather[0].description
      )
    document.querySelector("#current-time").innerHTML = formatDate(new Date());
    if(iconNumber < 5) {
      background.id ="clear-sky"
    } if(iconNumber > 5 && iconNumber < 12) {
      background.id ="rainy"
    } if(iconNumber ===13 ) {
      background.id ="snowy"
    } if(iconNumber === 50) {
      background.id ="misty"
    }

    // Re-set forecast button
    if (forecastToday.classList[0] === "forecast-not-active") {
      forecastToday.classList.remove("forecast-not-active");
      forecastToday.classList.add("forecast-active");
  
      forecast5Days.classList.remove("forecast-active")
      forecast5Days.classList.add("forecast-not-active")
    }

    // re-set to celsius button
    if (celsius.classList[2] === "not-active") {
      fahrenheit.classList.remove("active-button");
      fahrenheit.classList.add("not-active");

      celsius.classList.remove("not-active")
      celsius.classList.add("active-button")

      for (let i=0; i<7; i++) {
      tempUnit[i].innerHTML = "ºC"
    }
    }

      latitude = response.data.coord.lat;
      longitude = response.data.coord.lon;

      forecastbyday(latitude, longitude)
  }

// Forecast weather info from the API
  // show 3-hourly forecast on the page
  function displayForecast (response) {
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = null;
    forecastTemperature= response.data.list
    let forecast = null

    for (let index = 0; index < 5; index++) {
      forecast = response.data.list[index];

      forecastElement.innerHTML +=`
        <div class="col col-formatting">
          <ul>
            <li>
              ${formathours(forecast.dt * 1000)}
            </li>
            <li>
              <img src = "images/${forecast.weather[0].icon}.png" class="forecast-icons">
            </li>
            <li>
            <span id="forecast-temp">${Math.round(forecast.main.temp)}</span><span id="temp-unit">ºC</span>
            </li>
          </ul>
        </div>
      `;
    }
  }

  // Run the next 5 days of forecast and store the data
  function forecastDailyTemp (response) {
    forecastDaily = response.data.daily
  }

// Forecast Menu functions (view Today's forecast or the next 5 days forecast)
  // show next 5 days forecast on the page
  function showNext5Days(event) {
  event.preventDefault();
    let forecastElement = document.querySelector("#forecast");
    let forecastDailyTemp = null
    forecastElement.innerHTML = ""

      for (let i= 1; i < 6; i++) {
        forecastDailyTemp = forecastDaily[i]
      forecastElement.innerHTML +=`
          <div class="col col-formatting">
            <ul>
              <li>
                ${formatShortDays(forecastDailyTemp.dt *1000)}
              </li>
              <li>
                <img src = "images/${forecastDailyTemp.weather[0].icon}.png" class="forecast-icons">
              </li>
              <li>
              <span id="forecast-temp">${Math.round(forecastDailyTemp.temp.day)}</span><span id="temp-unit">ºC</span>
              </li>
            </ul>
          </div>
        `;
    }

    forecastToday.classList.remove("forecast-active");
    forecastToday.classList.add("forecast-not-active");

    forecast5Days.classList.remove("forecast-not-active")
    forecast5Days.classList.add("forecast-active")
  }


  // show today's weather again when user click "today button"
  function showForecastToday(event) {
    event.preventDefault();
    let forecastElement = document.querySelector("#forecast");
    let forecastTempToday = null;

    forecastElement.innerHTML = ""

    for (let i= 0; i < 5; i++) {
      forecastTempToday = forecastTemperature[i];

    forecastElement.innerHTML +=`
        <div class="col col-formatting">
          <ul>
            <li>
              ${formathours(forecastTempToday.dt * 1000)}
            </li>
            <li>
              <img src = "images/${forecastTempToday.weather[0].icon}.png" class="forecast-icons">
            </li>
            <li>
            <span id="forecast-temp">${Math.round(forecastTempToday.main.temp)}</span><span id="temp-unit">ºC</span>
            </li>
          </ul>
        </div>
      `;
  }
    // Add the active class to the Today's button
    forecastToday.classList.remove("forecast-not-active");
    forecastToday.classList.add("forecast-active");

    // Remove the active class from the next five days button
    forecast5Days.classList.remove("forecast-active")
    forecast5Days.classList.add("forecast-not-active")
  }

//Unit conversion (Toggle from Fahrenheit to Celsius and vice versa) 
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
    fahrenheit.classList.remove("not-active");
    fahrenheit.classList.add("active-button");

    celsius.classList.remove("active-button")
    celsius.classList.add("not-active")

    // Change forecast based on which forecast toggle is active
    if(forecastToday.classList[0] ==="forecast-active") {
      for (let i=0; i<5; i++) {
    forecastTempElement[i].innerHTML = Math.round((forecastTemperature[i].main.temp * 9/5) + 32);
      } 
    } if(forecastToday.classList[0] ==="forecast-not-active") {
      for (let i=0; i<5; i++) {
    forecastTempElement[i].innerHTML = Math.round((forecastDaily[i+1].temp.day * 9/5) + 32);
      } 
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
    fahrenheit.classList.remove("active-button");
    fahrenheit.classList.add("not-active");

    celsius.classList.remove("not-active")
    celsius.classList.add("active-button")

    // Change forecast based on which forecast toggle is active
    if(forecastToday.classList[0] ==="forecast-active") {
    for (let i=0; i<5; i++) {
    forecastTempElement[i].innerHTML = Math.round(forecastTemperature[i].main.temp);
  }
    } if(forecastToday.classList[0] ==="forecast-not-active") {
    for (let i=0; i<5; i++) {
    forecastTempElement[i].innerHTML = Math.round(forecastDaily[i+1].temp.day);
      } 
    }
  }

// Start
  // Global variables
  let celsiusTemperature = null;
  let feelsLikeTemperature = null;
  let forecastTemperature = null;
  let latitude = null;
  let longitude = null;
  let apiKey = "5a9b3c5051ae04b7172dded8be3de831";
  let forecastDaily = null;

// Call functions

// call Weather API at the start
  callWeatherApi("London");

  // Change city 
  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", updateCity);

  // Change to Fahrenheit
  let fahrenheit = document.querySelector("#convert-to-fahrenheit");
  fahrenheit.addEventListener("click", convertToFahrenheit);

    // Change to Celsius
  let celsius = document.querySelector("#convert-to-celsius");
  celsius.addEventListener("click", changeToCelsius)

  // Get location based weather
  let currentlocation = document.querySelector("#location-icon");
  currentlocation.addEventListener("click", getCurrentPosition)

  // Show the next 5 days of forecast
  let forecast5Days = document.querySelector("#forecast-5days");
  forecast5Days.addEventListener("click", showNext5Days);

  // Show today's forecast again
  let forecastToday = document.querySelector("#forecast-today");
  forecastToday.addEventListener("click", showForecastToday);
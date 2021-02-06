
function displayTemp(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  let icon = response.data.weather[0].icon;

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

}

function callWeatherApi(city) {
  let cityName = city;
  let apiKey = "5a9b3c5051ae04b7172dded8be3de831";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather"
  let apiUrl = `${apiEndpoint}?q=${cityName}&units=${units}&appid=${apiKey}`;
  
  axios.get(apiUrl).then(displayTemp);
}

// call Weather API at the start
callWeatherApi("London");
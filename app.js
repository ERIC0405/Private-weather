const apiKey = `b8aa8c39c4012f71e59cf320be595b6b`;

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getCurrentWeatherJson(latitude, longitude)
  .then((json) => renderCurrentWeather(json));
  getForecastJson(latitude, longitude)
    .then((json) => console.log(json))
}

function error() {
  status.textContent = "Unable to retrieve your location";
}

function getCurrentWeatherJson(latitude, longitude) {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`There is a problem in current weather`);
      }
    });
  }

  function renderCurrentWeather(json) {
    const currentConditionsEle = document.querySelector(`.current-conditions`);
  
    currentConditionsEle.innerHTML = `
       <h2>Current Conditions</h2>
       <img src="http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png" />
       <div class="current">
       <div class="temp">${Math.round(json.main.temp)}℃</div>
       <div class="condition">${json.weather[0].description}</div>
      `;
  }

  function getForecastJson(latitude, longitude) {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`There is a problem in  forecast`);
        }
      });
  }
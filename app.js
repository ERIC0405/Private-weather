const apiKey = `b8aa8c39c4012f71e59cf320be595b6b`;

class Forecast {
  constructor(daysLater,list) {
    this.daysLater = daysLater;
    this.icon = this._getIcon(list);
    this.weather = this._getWeather(list);
    this.highestTemp = this._getHighestTemp(list);
    this.lowestTemp = this._getLowestTemp(list);
    this.day = this._getDay();
  }

  _getNoonWeather(list) {
    const noonWeatherList = list.filter((ele) => {

      const date = new Date(ele[`dt_txt`]);
      return date.getHours() === 12;
    })

    return noonWeatherList[this.daysLater - 1];
  }

  _getIcon(list) {
    const noonWeather = this._getNoonWeather(list);
    return `http://openweathermap.org/img/wn/${noonWeather.weather[0].icon}@2x.png`;
  }

  _getWeather(list) {
    const noonWeather = this._getNoonWeather(list);
    return noonWeather.weather[0].description;
  }

  _getOneDayWeatherArray(list) {
  const today = new Date().getDay();
  const daysAWeek = 7;
  const OneDayWeatherArray = list.filter((ele) => {

    const date = new Date(ele[`dt_txt`]);
    if (today + this.daysLater < daysAWeek) {
      return date.getDay() === today + this.daysLater;
    } else {
      return date.getDay() === today + this.daysLater - daysAWeek;
    }
  })

  return OneDayWeatherArray;
}

  _getHighestTemp(list) {
  const oneDayWeatherArray = this._getOneDayWeatherArray(list);

  oneDayWeatherArray.sort((a, b) => {
    return b.main[`temp_max`] - a.main[`temp_max`];
  })

  return Math.round(oneDayWeatherArray[0].main[`temp_max`]);
}

_getLowestTemp(list) {
  const oneDayWeatherArray = this._getOneDayWeatherArray(list);

  oneDayWeatherArray.sort((a, b) => {
    return a.main[`temp_min`] - b.main[`temp_min`];
  })

  return Math.round(oneDayWeatherArray[0].main[`temp_min`]);
 }

 _getDay() {
  const today = new Date().getDay();
  const days = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`];
  const daysAWeek = 7;

  if (today + this.daysLater < daysAWeek) {
    return days[today + this.daysLater];
  } else {
    return days[today + this.daysLater - daysAWeek];
  }
}
}

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getCurrentWeatherJson(latitude, longitude)
  .then((json) => renderCurrentWeather(json));
  getForecastJson(latitude, longitude)
  .then((json) => renderForcast(json))
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

  function renderForcast(json) {
    const forecastContainer = document.querySelector(`.forecast`);
    const forecastDays = 5;
    let html = ``;
  
    for (let daysLater = 1; daysLater <= forecastDays; daysLater++ ){
      const forcast = new Forecast(daysLater, json.list);
      html += `
      <div class="day">
            <h3>${forcast.day}</h3>
            <img src="${forcast.icon}" />
            <div class="description">${forcast.weather}</div>
            <div class="temp">
              <span class="high">${forcast.highestTemp}℃</span>/<span class="low">${forcast.lowestTemp}℃</span>
            </div>
          </div>
      `;
    }
  
    forecastContainer.innerHTML = html;
  }
function getWeather() {
  const apiKey = "26c10b31060598ce867845631db6edd7";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Inserire una città");
    return;
  }
  const currentWeatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}";
  const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}";

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Errore nel recupero dei dati meteo attuali:", error);
      alert("Errore nel recupero dei dati meteo attuali. Riprovare.");
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Errore nel recupero dei dati meteo attuali:", error);
      alert("Errore nel recupero dei dati meteo attuali. Riprovare.");
    });

  function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    // Clear previous content
    weatherInfoDiv.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";
    tempDivInfo.inneHTML = "";

    if (data.cod === "404") {
      weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
      const cityName = data.name;
      const temperature = Math.round(data.main.temp - 273.15);
      const description = data.weather[0].description;
      const iconCode = data.Weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      const temperatureHTML = `<p>${temperature}°C</p>`;

      const weatherHtml = `
      <p>${cityName}</p>
      <p>${description}</p>
      `;

      tempDivInfo.innerHTML = temperatureHTML;
      weatherInfoDiv.innerHTML = weatherHtml;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = description;

      showImage();
    }
  }

  function displayHourForecast(hourlyData) {
    const hourlyForecastDiv = docuemnt.getElementById("hourly-forecast");
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach((item) => {
      const dateTime = new Date(item.dt * 1000);
      const hour = dateTime.getHours();
      const temperature = Math.round(item.main.temp - 273.15);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>
    `;
      hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
  }

  function showImage() {
    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.style.display = "block";
  }
}

function getWeather() {
  const apikey = "901df8338da2505e2bb3e5b51a0d3c6a";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Inserire una città");
    return;
  }
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Errore nel recupero dei dati meteo attuali:", error);
      alert(
        "Errore nel recupero dei dati meteo attuali. Per favore riprovare."
      );
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Errore nel recupero dei dati meteo attuali:", error);
      alert(
        "Errore nel recupero dei dati meteo attuali. Per favore riprovare."
      );
    });

  const weatherTranslation = {
    "clear skyt": "cielo sereno",
    "few clouds": "poche nuvole",
    "scattered clouds": "nuvole sparse",
    "broken clouds": "nuvoloso",
    "shower rain": "pioggia a tratti",
    rain: "pioggia",
    thunderstorm: "temporale",
    snow: "neve",
    mist: "foschia",
  };

  function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    // Clear previous content
    weatherInfoDiv.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";
    tempDivInfo.innerHTML = "";

    if (data.cod === "404") {
      weatherInfoDiv.innerHTML = `<p>${data.message}. Per favore , inserisci una città valida.</p>`;
      return;
    } else {
      const cityName = data.name;
      const temperature = Math.round(data.main.temp - 273.15);
      const description = data.weather[0].description;
      const translatedDescription =
        weatherTranslation[description] || description;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      const temperatureHTML = `<p>${temperature}°C</p>`;

      const weatherHtml = `<p>${cityName}</p><p>${translatedDescription}</p>`;

      tempDivInfo.innerHTML = temperatureHTML;
      weatherInfoDiv.innerHTML = weatherHtml;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = description;

      showImage();
    }
  }

  function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    hourlyForecastDiv.innerHTML = "";

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach((item) => {
      const dateTime = new Date(item.dt * 1000);
      const hour = dateTime.getHours().toString().padStart(2, "0");
      const temperature = Math.round(item.main.temp - 273.15);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml = `
          <div class="hourly-item">
              <span>${hour}:00</span>
              <img src="${iconUrl}" alt="${translatedDescription}">
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

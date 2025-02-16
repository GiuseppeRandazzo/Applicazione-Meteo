function getWeather() {
  const apikey = "LA-TUA-API-KEY-QUI"; // Inserire la propria API key

  const weatherTranslations = {
    "clear sky": "cielo sereno",
    "few clouds": "poche nuvole",
    "scattered clouds": "nuvole sparse",
    "broken clouds": "nuvoloso",
    "shower rain": "pioggia a tratti",
    rain: "pioggia",
    thunderstorm: "temporale",
    snow: "neve",
    mist: "foschia",
    "overcast clouds": "molto nuvoloso", // Aggiunta
    "light rain": "pioggia leggera", // Aggiunta
    "moderate rain": "pioggia moderata", // Aggiunta
    "heavy rain": "pioggia forte", // Aggiunta
    fog: "nebbia", // Aggiunta
  };

  const city = document.getElementById("city").value;

  if (!city) {
    alert("Inserire una città");
    return;
  }

  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.innerHTML = "Caricamento...";
  document.body.appendChild(loadingDiv);

  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    fetch(currentWeatherUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
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

    function kelvinToCelsius(kelvin) {
      return Math.round(kelvin - 273.15);
    }

    function displayWeather(data) {
      try {
        // Memorizzazione delle referenze DOM
        const elements = {
          tempDiv: document.getElementById("temp-div"),
          weatherInfo: document.getElementById("weather-info"),
          weatherIcon: document.getElementById("weather-icon"),
          hourlyForecast: document.getElementById("hourly-forecast"),
          cityInput: document.getElementById("city"),
        };

        if (
          !elements.tempDiv ||
          !elements.weatherInfo ||
          !elements.weatherIcon ||
          !elements.hourlyForecast
        ) {
          throw new Error("Elementi DOM non trovati");
        }

        // Clear previous content
        elements.weatherInfo.innerHTML = "";
        elements.hourlyForecast.innerHTML = "";
        elements.tempDiv.innerHTML = "";

        if (data.cod !== 200) {
          elements.weatherInfo.innerHTML = `<p>${data.message}. Per favore, inserisci una città valida.</p>`;
          return;
        }

        const cityName = data.name;
        const temperature = kelvinToCelsius(data.main.temp);
        const description = data.weather[0].description;
        const translatedDescription =
          weatherTranslations[description] || description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${translatedDescription}</p>`;

        elements.tempDiv.innerHTML = temperatureHTML;
        elements.weatherInfo.innerHTML = weatherHtml;
        elements.weatherIcon.src = iconUrl;
        elements.weatherIcon.alt = translatedDescription;

        showImage();
      } catch (error) {
        console.error("Errore nella visualizzazione del meteo:", error);
        alert("Si è verificato un errore nella visualizzazione del meteo");
      }
    }

    function displayHourlyForecast(hourlyData) {
      const hourlyForecastDiv = document.getElementById("hourly-forecast");
      hourlyForecastDiv.innerHTML = "";

      const next24Hours = hourlyData.slice(0, 8);

      next24Hours.forEach((item) => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours().toString().padStart(2, "0");
        const temperature = kelvinToCelsius(item.main.temp);
        const description = item.weather[0]?.description || "N/A";
        const translatedDescription =
          weatherTranslations[description] || description;
        const iconCode = item.weather[0]?.icon || "";
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
      if (weatherIcon) {
        weatherIcon.style.display = "block";
      }
    }
  } finally {
    document.body.removeChild(loadingDiv);
  }
}

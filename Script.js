function getWeather() {
  const apiKey = "26c10b31060598ce867845631db6edd7";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Inserire una città");
    return;
  }
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Errore nel recupero dei dati meteo attuali:", error);
      alert("Errore nel recupero dei dati meteo attuali. Riprovare.");
    });

  function displayWeather(data) {}
}

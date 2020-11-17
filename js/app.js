import {
  darkSkyApiKey,
  geoApiKey,
  ipLocationApiKey,
  darkSkyAPI,
  updateTemp,
  updateWeekdays,
  updateImages,
  graphHopperAPI,
} from "./utils";
import { addLoadingPage, removeLoadingPage } from "./functions";
import { retrieveUserGeolocationFromBrowser } from "./locationFromBrowser";
import { addWeatherBox } from "./addWeatherBox";

const userGeo = retrieveUserGeolocationFromBrowser();

const locateUser = async () => {
  try {
    addLoadingPage();

    const ipLocationResponse = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.ipgeolocation.io/ipgeo?apiKey=${ipLocationApiKey}`
    );

    const ipLocationResponseJson = await ipLocationResponse.json();

    const { latitude, longitude, city } = ipLocationResponseJson;

    const weatherForecastResponse = await fetch(
      `${darkSkyAPI}/${darkSkyApiKey}/${latitude},${longitude}?units=si&exclude=minutely,hourly,alerts,flags&lang=en`
    );

    const weatherForecastResponseJson = await weatherForecastResponse.json();

    const { currently, daily } = weatherForecastResponseJson;

    document.querySelector(".city__name").innerHTML = city;
    document.querySelector(".pressure__value").innerHTML =
      Math.floor(currently.pressure) + " hPa";

    currently.humidity === 1
      ? (document.querySelector(".humidity__value").innerHTML = "100%")
      : (document.querySelector(".humidity__value").innerHTML =
          (currently.humidity * 100).toPrecision("2") + " %");

    document.querySelector(".wind-speed__value").innerHTML =
      currently.windSpeed + " m/s";

    const currentWeatherIcon = currently.icon;
    const otherDayWeatherIcons = [
      daily.data[0].icon,
      daily.data[1].icon,
      daily.data[2].icon,
      daily.data[3].icon,
      daily.data[4].icon,
    ];

    const forecastTemperature = [
      currently.temperature,
      daily.data[0].temperatureHigh,
      daily.data[1].temperatureHigh,
      daily.data[2].temperatureHigh,
      daily.data[3].temperatureHigh,
      daily.data[4].temperatureHigh,
    ];

    updateWeekdays();
    updateImages(currentWeatherIcon, otherDayWeatherIcons);
    updateTemp(forecastTemperature);
    removeLoadingPage();
  } catch (e) {
    console.error(e);
  }
};

locateUser();

const newCityForecast = async () => {
  const input = document.querySelector("#search").value;
  document.querySelector(".search-error").innerHTML = "";

  if (!input) {
    document.querySelector(".search-error").innerHTML =
      "Forecast for empty place could not be retrieved!";
    return;
  }

  addLoadingPage();

  try {
    const response = await fetch(`${graphHopperAPI}&q=${input}`);
    const json = await response.json();

    if (json.hits.length === 0) {
      document.querySelector(".search-error").innerHTML =
        "Certain place could not be found";
    }

    let point = json.hits[0].point;

    const darkSkyAPI =
      "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";

    const darkSkyForecast = await fetch(
      `${darkSkyAPI}/${darkSkyApiKey}/${point.lat},${point.lng}?units=si&exclude=minutely,hourly,alerts,flags&lang=en`
    );
    const darkSkyForecastJson = await darkSkyForecast.json();

    addWeatherBox(darkSkyForecastJson, json.hits[0].name);
  } catch (e) {
    console.log(e);
  }
  removeLoadingPage();
};

window.addEventListener("DOMContentLoaded", () => {
  const addNewPlaceButton = document.querySelector("#add-city");
  const searchBox = document.querySelector(".find-city");
  const closeSearchButton = document.querySelector(".btn-close-find");
  const submitSearchButton = document.querySelector("#search-btn");
  const searchInput = document.querySelector("#search");
  const originBoxCloseButton = document.querySelector("#origin-box-delete");

  addNewPlaceButton.addEventListener("click", () => {
    searchBox.hasAttribute("hidden")
      ? searchBox.removeAttribute("hidden")
      : null;
    searchInput.focus();
  });

  closeSearchButton.addEventListener("click", () => {
    document.querySelector("#search").value = "";
    document.querySelector(".search-error").innerHTML = "";

    searchBox.hasAttribute("hidden") ? null : (searchBox.hidden = true);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      newCityForecast();
      document.querySelector("#search").value = "";
    }
  });

  submitSearchButton.addEventListener("click", (e) => {
    e.preventDefault();
    newCityForecast();
    document.querySelector("#search").value = "";
  });

  originBoxCloseButton.addEventListener("click", () => {
    originBoxCloseButton.parentElement.hidden = true;
  });
});

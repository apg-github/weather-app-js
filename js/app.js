import {
  darkSkyApiKey,
  ipLocationAPI,
  updateTemp as updateTemperature,
  updateWeekdays,
  updateImages,
} from "./utils";
import { addLoadingPage, removeLoadingPage } from "./functions";
import { retrieveUserGeolocationFromBrowser } from "./locationFromBrowser";
import { newCityForecast } from "./newForecast";

const nodeFetch = require("node-fetch");

const userGeo = retrieveUserGeolocationFromBrowser();

const locateUser = async () => {
  try {
    addLoadingPage();

    const ipLocationResponse = await fetch(ipLocationAPI);

    const ipLocationResponseJson = await ipLocationResponse.json();

    let { latitude, longitude, city } = ipLocationResponseJson;

    // if (userGeo.latitude && userGeo.longitude) {
    //   try {
    //     latitude = userGeo.latitude.toPrecision(6);
    //     longitude = userGeo.longitude.toPrecision(6);

    //     const reverseGeocoding = await fetch(
    //       `https://us1.locationiq.com/v1/reverse.php?key=pk.67351fa88cded971aff48cb2fede88d2&lat=${latitude}&lon=${longitude}&format=json`
    //     );
    //     reverseGeocodingJson = await reverseGeocoding.json();
    //     console.log(reverseGeocodingJson);
    //   } catch {
    //     (e) => {
    //       console.log(e);
    //     };
    //   }
    // }

    // const weatherForecastResponse = await fetch(
    //   `https://thingproxy.freeboard.io/fetch/https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude}?units=si&exclude=minutely,hourly,alerts,flags&lang=en`
    // );


    const weatherForecastResponse = await fetch(
      `https://thingproxy.freeboard.io/fetch/https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude}?units=si&exclude=minutely,hourly,alerts,flags&lang=en`
    );

    const weatherForecastResponseJson = await weatherForecastResponse.json();
    console.log(weatherForecastResponseJson);
    const { currently, daily } = weatherForecastResponseJson;

    document.querySelector(".city__name").innerHTML = city;
    document.querySelector(".pressure__value").innerHTML = Math.floor(currently.pressure) + " hPa";

    currently.humidity === 1
      ? (document.querySelector(".humidity__value").innerHTML = "100%")
      : (document.querySelector(".humidity__value").innerHTML =
          (currently.humidity * 100).toPrecision("2") + " %");

    document.querySelector(".wind-speed__value").innerHTML = currently.windSpeed + " m/s";

    const forecastWeatherIcons = [
      currently.icon,
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
    updateImages(forecastWeatherIcons);
    updateTemperature(forecastTemperature);
    removeLoadingPage();
  } catch (e) {
    console.error(e);
  }
};

locateUser();

window.addEventListener("DOMContentLoaded", () => {
  const addNewPlaceButton = document.querySelector("#add-city");
  const searchBox = document.querySelector(".find-city");
  const closeSearchButton = document.querySelector(".btn-close-find");
  const submitSearchButton = document.querySelector("#search-btn");
  const searchInput = document.querySelector("#search");
  const originBoxCloseButton = document.querySelector("#origin-box-delete");

  addNewPlaceButton.addEventListener("click", () => {
    searchBox.hasAttribute("hidden") ? searchBox.removeAttribute("hidden") : null;
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

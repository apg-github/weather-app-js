import {darkSkyApiKey, geoApiKey, ipLocationApiKey} from "./utils";
import {addLoadingPage, removeLoadingPage} from "./functions";


//! event listeners for add city or remove city div
(() => {
  const btn = document.querySelector("#add-city");
  const findLocationDiv = document.querySelector(".find-city");
  btn.addEventListener("click", () => {
    if (findLocationDiv.hasAttribute("hidden")) {
      findLocationDiv.removeAttribute("hidden");
    }
  });
  const btnRemoveCity = document.querySelector(".btn-close-find");
  btnRemoveCity.addEventListener("click", () => {
    document.querySelector("#search").value = "";
    document.querySelector(".search-error").innerHTML = ""
    if (!findLocationDiv.hasAttribute("hidden")) {
      findLocationDiv.hidden = true;
    }
  });
})();

const locateUser = async () => {
  try {
    addLoadingPage();

    const ipLocationResponse = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${ipLocationApiKey}`
    );

    const ipLocationResponseJson = await ipLocationResponse.json();

    const { latitude, longitude } = ipLocationResponseJson;

    const darkSkyAPI = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";

    const weatherForecastResponse = await fetch(
      `${darkSkyAPI}/${darkSkyApiKey}/${latitude},${longitude}?units=si&exclude=minutely,hourly,alerts,flags&lang=pl`
    );

    const weatherForecastResponseJson = await weatherForecastResponse.json();

    document.querySelector(".city__name").innerHTML = ipLocationResponseJson.city;
    document.querySelector(".pressure__value").innerHTML =
      Math.floor(weatherForecastResponseJson.currently.pressure) + " hPa";

    weatherForecastResponseJson.currently.humidity === 1
      ? (document.querySelector(".humidity__value").innerHTML = "100%")
      : (document.querySelector(".humidity__value").innerHTML =
          (weatherForecastResponseJson.currently.humidity * 100).toPrecision("2") + " %");

    document.querySelector(".wind-speed__value").innerHTML =
      weatherForecastResponseJson.currently.windSpeed + " m/s";

    let currentIcon = weatherForecastResponseJson.currently.icon;
    let daily = weatherForecastResponseJson.daily.data;
    let restIcons = [daily[0].icon, daily[1].icon, daily[2].icon, daily[3].icon, daily[4].icon];

    updateWeekdays();
    updateImages(currentIcon, restIcons);

    let mainTemp = weatherForecastResponseJson.currently.temperature;
    let restTemp = [
      mainTemp,
      daily[0].temperatureHigh,
      daily[1].temperatureHigh,
      daily[2].temperatureHigh,
      daily[3].temperatureHigh,
      daily[4].temperatureHigh,
    ];

    updateTemp(restTemp);
  } catch (e) {
    console.error(e);
    alert("Disable your adblock software for this site to make forecast work properly");
  }
  removeLoadingPage();
};

locateUser()

//! function to fetch new data of user city
const newCityForecast = async () => {
  let input = document.querySelector("#search").value;
  document.querySelector(".search-error").innerHTML = "";

  if (!input) {
    document.querySelector(".search-error").innerHTML =
      "New place could not be empty!";
    return;
  }

  addLoadingPage();

  try {
    const response = await fetch(
      `https://graphhopper.com/api/1/geocode?key=${geoApiKey}&q=${input}`
    );
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

const addWeatherBox = (data, name) => {
  let app = document.querySelector("#app");
  var itm = document.querySelector(".module__weather");
  var cln = itm.cloneNode(true);
  cln.hidden = false;

  cln.childNodes[1].addEventListener("click", () => {
    cln.childNodes[1].parentElement.remove();
  });

  cln.children[1].children[0].children[0].setAttribute(
    "src",
    `./images/icons/${data.currently.icon}.svg`
  );

  cln.children[1].children[1].children[0].innerHTML = name;
  cln.children[1].children[1].children[1].innerHTML =
    Math.floor(data.currently.temperature) + "°C";

  let wDetails = cln.children[1].children[2];

  let wDetailsNums = [
    data.currently.pressure,
    data.currently.humidity,
    data.currently.windSpeed,
  ];

  wDetails.children[0].children[1].innerHTML =
    Math.floor(wDetailsNums[0]) + " hPa";

  wDetailsNums[1] == 1
    ? (wDetails.children[1].children[1].innerHTML = "100%")
    : (wDetails.children[1].children[1].innerHTML =
        (wDetailsNums[1] * 100).toPrecision(2) + " %");

  wDetails.children[2].children[1].innerHTML = wDetailsNums[2] + " m/s";

  //!change forecast for 5 days
  let lis = cln.children[1].children[3].children;
  let num = 0;
  Array.from(lis).forEach((child) => {
    child.children[1].setAttribute(
      "src",
      `./images/icons/${data.daily.data[num].icon}.svg`
    );
    child.children[2].children[0].innerHTML = Math.floor(
      data.daily.data[num].temperatureHigh
    );
    num++;
  });

  app.insertBefore(cln, app.children[1]);
};

//! function to update images while starting application
function updateImages(mainSrc, restSrc) {
  let imagesToInsert = document.querySelectorAll(".iconsOfDays");
  let [firstImg, ...images] = imagesToInsert;
  let i = 0;

  firstImg.setAttribute("src", `./images/icons/${mainSrc}.svg`);

  images.forEach(img => {
    img.setAttribute("src", `./images/icons/${restSrc[i]}.svg`);
    i++;
  });
}

//! function to update temp while starting application
function updateTemp(restTemp) {
  let tempSpans = document.querySelectorAll(".temperature__value");
  let i = 0;

  tempSpans.forEach((el) => {
    el.innerHTML = Math.floor(restTemp[i]);
    i++;
  });
}

//! function to update weekday names while starting application
function updateWeekdays() {
  const daysToInsert = document.querySelectorAll(".day");
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayNowNum = new Date().getDay();

  let i = dayNowNum;
  daysToInsert.forEach((span) => {
    if (i === 6) {
      i = 0;
      span.innerHTML = weekdays[i];
      return;
    }
    i++;
    span.innerHTML = weekdays[i];
  });
}

//! function to obtain new city and display new forecast
window.addEventListener("DOMContentLoaded", (event) => {
  let subButton = document.querySelector("#search-btn");
  let searchInput = document.querySelector("#search");

  searchInput.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      newCityForecast();
      document.querySelector("#search").value = "";
    }
  });

  subButton.addEventListener("click", (e) => {
    e.preventDefault();
    newCityForecast();
    document.querySelector("#search").value = "";
  });

  let originBoxDeleteKey = document.querySelector("#origin-box-delete");

  originBoxDeleteKey.addEventListener("click", () => {
    originBoxDeleteKey.parentElement.hidden = true;

  });
});

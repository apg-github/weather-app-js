const body = document.body;
const addLoadingPage = () => body.classList.add("loading");
const removeLoadingPage = () => body.classList.remove("loading");
//!event listeners for add city or remove city div
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
    if (!findLocationDiv.hasAttribute("hidden")) {
      findLocationDiv.hidden = true;
    }
  });
})();

const locateUser = async () => {
  try {
    addLoadingPage();
    const response = await fetch(
      "https://api.ipgeolocation.io/ipgeo?apiKey=015c9e6c6d6e44358b28e71a71af12b3"
    );
    const data = await response.json();
    const { latitude, longitude } = data;
    const apiKey = "703a3af8f6c99dde6d1e12e0cc2484af";
    const darkSkyAPI =
      "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
    const response2 = await fetch(
      `${darkSkyAPI}/${apiKey}/${latitude},${longitude}?units=si&exclude=minutely,hourly,alerts,flags&lang=pl`
    );
    const weatherObj = await response2.json();
    //console.log(weatherObj);
    document.querySelector(".city__name").innerHTML = data.city;
    document.querySelector(".pressure__value").innerHTML =
      Math.floor(weatherObj.currently.pressure) + " hPa";
    document.querySelector(".humidity__value").innerHTML =
      (weatherObj.currently.humidity * 100).toPrecision("2") + " %";
    document.querySelector(".wind-speed__value").innerHTML =
      weatherObj.currently.windSpeed + " m/s";
    let mainSrc = weatherObj.currently.icon;
    let fc = weatherObj.daily.data;
    let restSrc = [fc[0].icon, fc[1].icon, fc[2].icon, fc[3].icon, fc[4].icon];

    UpdateWeekdays();
    updateImages(mainSrc, restSrc);

    let mainTemp = weatherObj.currently.temperature;
    let restTemp = [
      mainTemp,
      fc[0].temperatureHigh,
      fc[1].temperatureHigh,
      fc[2].temperatureHigh,
      fc[3].temperatureHigh,
      fc[4].temperatureHigh
    ];
    updateTemp(restTemp);
  } catch (e) {
    console.log(e);
  }
  removeLoadingPage();
};
locateUser();

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
    const geoKey = "0d77bc1c-b67d-4885-a89e-b2bc5fe71eee";
    const response = await fetch(
      `https://graphhopper.com/api/1/geocode?key=${geoKey}&q=${input}`
    );
    const json = await response.json();
    if (json.hits.length === 0) {
      document.querySelector(".search-error").innerHTML =
        "Certain place could not be found";
    }
    let point = json.hits[0].point;
    const apiKey = "703a3af8f6c99dde6d1e12e0cc2484af";
    const darkSkyAPI =
      "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";

    const response2 = await fetch(
      `${darkSkyAPI}/${apiKey}/${point.lat},${point.lng}?units=si&exclude=minutely,hourly,alerts,flags&lang=pl`
    );
    const json2 = await response2.json();
    //console.log(json2);
    addWeatherBox(json2, json.hits[0].name);
  } catch (e) {
    console.log(e);
  }
  removeLoadingPage();
};
//! function that creates new module of weather forecast
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
  //! city name
  cln.children[1].children[1].children[0].innerHTML = name;
  //! temp in city
  cln.children[1].children[1].children[1].innerHTML = Math.floor(
    data.currently.temperature
  );
  //! change weather details
  let wDetails = cln.children[1].children[2];
  let wDetailsNums = [
    data.currently.pressure,
    data.currently.humidity,
    data.currently.windSpeed
  ];
  wDetails.children[0].children[1].innerHTML =
    Math.floor(wDetailsNums[0]) + " hPa";
  wDetails.children[1].children[1].innerHTML =
    (wDetailsNums[1] * 100).toPrecision(2) + " %";
  wDetails.children[2].children[1].innerHTML = wDetailsNums[2] + " m/s";

  //!change forecast for 5 days
  let lis = cln.children[1].children[3].children;
  //console.log(lis);
  let num = 0;
  Array.from(lis).forEach(function(child) {
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
  firstImg.setAttribute("src", `./images/icons/${mainSrc}.svg`);
  let i = 0;
  images.forEach(img => {
    img.setAttribute("src", `./images/icons/${restSrc[i]}.svg`);
    i++;
  });
}
//! function to update temp while starting application
function updateTemp(restTemp) {
  let tempSpans = document.querySelectorAll(".temperature__value");
  let i = 0;
  tempSpans.forEach(el => {
    el.innerHTML = Math.floor(restTemp[i]);
    i++;
  });
}
//! function to update weekday names while starting application
function UpdateWeekdays() {
  let daysToInsert = document.querySelectorAll(".day");
  var weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const dayNowNum = new Date().getDay();
  //console.log(dayNowNum);
  let i = dayNowNum;
  daysToInsert.forEach(span => {
    if (i === 6) {
      i = 0;
      span.innerHTML = weekdays[i];
      return null;
    }
    i++;
    span.innerHTML = weekdays[i];
  });
}
//! function to obtain new city and display new forecast

window.addEventListener("DOMContentLoaded", event => {
  let subButton = document.querySelector("#search-btn");
  let searchInput = document.querySelector("#search");
  searchInput.addEventListener("keypress", e => {
    if (e.keyCode == 13) {
      e.preventDefault();
      newCityForecast();
    }
  });
  subButton.addEventListener("click", e => {
    e.preventDefault();
    newCityForecast();
  });
  let originBoxDeleteKey = document.querySelector("#origin-box-delete");
  originBoxDeleteKey.addEventListener("click", () => {
    originBoxDeleteKey.parentElement.hidden = true;
  });
});

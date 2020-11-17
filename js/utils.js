export const ipLocationApiKey = "015c9e6c6d6e44358b28e71a71af12b3";
export const geoApiKey = "0d77bc1c-b67d-4885-a89e-b2bc5fe71eee";
export const darkSkyApiKey = "703a3af8f6c99dde6d1e12e0cc2484af";

// https://cors-anywhere.herokuapp.com/

export const ipLocationAPI = `https://api.ipgeolocation.io/ipgeo?apiKey=${ipLocationApiKey}`;

export const darkSkyAPI =
  "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";

export const graphHopperAPI = `https://graphhopper.com/api/1/geocode?key=${geoApiKey}`;

export function updateTemp(temperatures) {
  let forecastTemperaturePlaceholders = document.querySelectorAll(
    ".temperature__value"
  );
  let i = 0;

  forecastTemperaturePlaceholders.forEach((el) => {
    el.innerHTML = Math.floor(temperatures[i]);
    i++;
  });
}

export const forecastDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function updateWeekdays() {
  const forecastDaysPlaceholders = document.querySelectorAll(".day");

  const todayDayNumber = new Date().getDay();

  let i = todayDayNumber;
  forecastDaysPlaceholders.forEach((span) => {
    if (i === 6) {
      i = 0;
      span.innerHTML = forecastDays[i];
      return;
    }
    i++;
    span.innerHTML = forecastDays[i];
  });
}

export function updateImages(forecastWeatherIcons) {
  let imagesToInsert = document.querySelectorAll(".iconsOfDays");
  let [firstImg, ...images] = imagesToInsert;
  let i = 1;

  firstImg.setAttribute("src", `./images/icons/${forecastWeatherIcons[0]}.svg`);

  images.forEach((img) => {
    img.setAttribute("src", `./images/icons/${forecastWeatherIcons[i]}.svg`);
    i++;
  });
}

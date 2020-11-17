const app = document.querySelector("#app");
const originWeatherBox = document.querySelector(".module__weather");

export const addWeatherBox = (data, name) => {
  const clonedWeatherBox = originWeatherBox.cloneNode(true);
  clonedWeatherBox.hidden = false;

  console.log(clonedWeatherBox.children[1].children[2]);

  clonedWeatherBox.querySelector("button").addEventListener("click", () => {
    clonedWeatherBox.remove();
  });

  clonedWeatherBox
    .querySelector(".weather__icon img")
    .setAttribute("src", `./images/icons/${data.currently.icon}.svg`);

  clonedWeatherBox.querySelector(".city").innerHTML = name;

  clonedWeatherBox.querySelector("div.temperature").innerHTML =
    Math.floor(data.currently.temperature) + "°C";

  const weatherForecastDetails = clonedWeatherBox.querySelector(
    ".weather__details"
  );

  (weatherForecastDetails.querySelector(".pressure__value").innerHTML =
    data.currently.pressure + " hPa"),
    (weatherForecastDetails.querySelector(".pressure__value").innerHTML =
      data.currently.humidity === 1
        ? "100%"
        : (data.currently.humidity * 100).toPrecision(2) + " %"),
    (weatherForecastDetails.querySelector(".pressure__value").innerHTML =
      data.currently.windSpeed + " m/s");

  const nextDaysForecast = clonedWeatherBox.querySelector(".weather__forecast")
    .children;
  let num = 0;

  Array.from(nextDaysForecast).forEach((day) => {
    day
      .querySelector(".iconsOfDays")
      .setAttribute("src", `./images/icons/${data.daily.data[num].icon}.svg`);

    day.querySelector(".temperature").textContent =
      Math.floor(data.daily.data[num].temperatureHigh) + "°C";
    num++;
  });

  app.insertBefore(clonedWeatherBox, app.children[1]);
};

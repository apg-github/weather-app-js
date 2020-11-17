import { addWeatherBox } from "./addWeatherBox";
import { addLoadingPage, removeLoadingPage } from "./functions";
import { darkSkyApiKey, darkSkyAPI, graphHopperAPI } from "./utils";

export const newCityForecast = async () => {
  const input = document.querySelector("#search").value;
  document.querySelector(".search-error").innerHTML = "";

  if (!input) {
    document.querySelector(".search-error").innerHTML =
      "Forecast for empty place could not be retrieved!";
    return;
  }

  addLoadingPage();

  try {
    const specifiedPlaceApiResponse = await fetch(
      `${graphHopperAPI}&q=${input}`
    );
    const specifiedPlaceApiResponseJson = await specifiedPlaceApiResponse.json();

    // hits.length === 0 means api found 0 matches
    if (specifiedPlaceApiResponseJson.hits.length === 0) {
      document.querySelector(".search-error").innerHTML =
        "Certain place could not be found, try again with another or check spelling";
      throw new Error();
    }

    // hits[0] means we choose returned place option that best fits the searched input value
    const { point, name } = specifiedPlaceApiResponseJson.hits[0];

    const weatherForecastResponse = await fetch(
      `${darkSkyAPI}/${darkSkyApiKey}/${point.lat},${point.lng}?units=si&exclude=minutely,hourly,alerts,flags&lang=en`
    );

    const weatherForecastResponseJson = await weatherForecastResponse.json();

    addWeatherBox(weatherForecastResponseJson, name);
  } catch (e) {
    null;
  }
  removeLoadingPage();
};

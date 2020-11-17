export const addWeatherBox = (data, name) => {
  const app = document.querySelector("#app");
  const itm = document.querySelector(".module__weather");
  const cln = itm.cloneNode(true);
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

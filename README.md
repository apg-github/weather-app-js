# weather-app-js
```diff
- CORS-ANYWHERE IS DOWN, live demo does not work correctly.

```

## Make sure you have disabled your ad blocking software while looking for online version.

Live demo: https://apg-weather-app.netlify.app/

Weather app is using three external API's to gain everything it needs.

App is responsive and mobile friendly.

## Screenshots from desktop/mobile version of app:
![ScreenShot](https://i.ibb.co/rwMWh5y/apg-weather-apg-desktop.png)

___

![ScreenShot](https://i.ibb.co/SxJqZsm/apg-weather-apg-mobile.png)

## Application uses three apis:
* `ipgeolocation.io` to gain longitude and latitude from IP address
* `darksky.net` to gain weather forecast data using longitude and latitude
* `graphhopper.com` to gain weather forecast from input value that user provide

## Known bugs:
* accessing site with adblocking software make application unusable
* workaround for CORS security with herokuapp sometimes gets laggy or unavailable, which makes api responses very slow

## TODO:
* store user favorite location in LocalStorage and fetch data for it on entrance
* add window.navigation to access longitute and latitude of user browser when adblocking software is on



# Created by apg

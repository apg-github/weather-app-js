# weather-app-js
## Make sure you have disabled your ad blocking software while looking for online version. !!

Weather app is using three external API's to gain everything it needs. 

To start an application locally type:
```
npm install
```
```
npm run build
```
```
npm run start
```

Localhost site will be builded and served

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

## Screenshots from desktop/mobile version of app:
![ScreenShot](https://lh4.googleusercontent.com/HqDf1snrSzmonaM8gA6bOIFz44xo_TptMaTXaX7c6akjvWlTg8-JT2L-WACZsdnAKLYv2NyZuFUvn56dKxrk=w2560-h1303-rw)

___

![ScreenShot](https://lh5.googleusercontent.com/wcLzcUy8_6L923_gJr3GsTYqrV_1-0-Fm7cQb71cGoCB132gudOzunn0bRt2V1Tb8zvfVFMrrtGjiPT6ZmZ-=w2559-h1303-rw)





# Created by apg

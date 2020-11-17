const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

export const retrieveUserGeolocationFromBrowser = () => {
  let userGeoData = new Object();
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const crd = pos.coords;
      userGeoData.latitude = crd.latitude;
      userGeoData.longitude = crd.longitude;
    },
    error,
    options
  );
  return userGeoData;
};

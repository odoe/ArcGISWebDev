require([
  'utils/OAuthHelper',
  'controllers/appcontroller',
  'services/mapservices',
  'dojo/domReady!'
], function (
  OAuthHelper,
  AppCtrl,
  mapServices
) {
  'use strict';

  function startApplication() {
    var appCtrl = new AppCtrl({
      elem: 'map-div',
      mapOptions: {
        basemap: 'streets',
        center: [-118.241, 34.0542],
        zoom: 12
      },
      layers: mapServices.loadServices()
    });
    appCtrl.load();
  }

  OAuthHelper.init({
    appId: 'zppZ53G093yZV7tG',
    portal: 'http://www.arcgis.com',
    expiration: (14 * 24 * 60),
    popup: false
  });

  if (OAuthHelper.isSignedIn()) {
    startApplication();
  } else {
    OAuthHelper.signIn().then(startApplication);
  }

});


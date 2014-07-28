require([
  'esri/arcgis/OAuthInfo',
  'esri/IdentityManager',
  'controllers/appcontroller',
  'services/mapservices',
  'dojo/domReady!'
], function (
  OAuthInfo, esriId,
  AppCtrl,
  mapServices
) {
  'use strict';

  esriId.destroyCredentials();

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

  var info = new OAuthInfo({
    appId: 'zppZ53G093yZV7tG',
    portal: 'http://www.arcgis.com',
    expiration: (14 * 24 * 60),
    popup: false
  });

  esriId.registerOAuthInfos([info]);

  esriId.checkSignInStatus(info.portalUrl)
    .then(startApplication)
    .otherwise(
      function() {
        esriId.getCredential(info.portalUrl)
        .then(startApplication);
      }
  );

});


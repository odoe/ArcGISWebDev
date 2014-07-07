require([
  'controllers/appcontroller',
  'services/mapservices',
  'dojo/domReady!'
], function (AppCtrl, mapServices) {
  'use strict';
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
});


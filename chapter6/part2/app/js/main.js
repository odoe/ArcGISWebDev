/*global require*/
/*jshint laxcomma:true*/
require([
  'esri/config',
  'dojo/dom',
  'dojo/on',
  'utils/OAuthHelper',
  'utils/securityUtil',
  'controllers/appcontroller',
  'services/mapservices',
  'dojo/domReady!'
], function (
  esriConfig,
  dom, on,
  OAuthHelper, securityUtil,
  AppCtrl,
  mapServices
) {
  'use strict';

  //esriConfig.defaults.io.proxyUrl = '/app/proxy.ashx';
  //esriConfig.defaults.io.alwaysUseProxy = true;

  OAuthHelper.init({
    appId: 'zppZ53G093yZV7tG',
    portal: 'http://www.arcgis.com',
    expiration: (14 * 24 * 60),
    popup: false
  });

  function startApplication() {
    dom.byId('signin-elem').innerHTML = 'Sign Out';

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

  function clearApplication() {
    securityUtil.removeCredentials();
    OAuthHelper.signOut();
  }

  if (OAuthHelper.isSignedIn()) {
    securityUtil.saveCredentials().then(startApplication);
  } else {
    securityUtil.loadCredentials().then(function(success) {
      if (success) {
        startApplication();
      }
    });
  }

  on(dom.byId('signin-elem'), 'click', function(e) {
    e.preventDefault();
    if (e.target.innerHTML === 'Sign In') {
      OAuthHelper.signIn().then(startApplication);
    } else {
      clearApplication();
    }
  });

});


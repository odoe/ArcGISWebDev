require([
  'dojo/_base/lang',
  'esri/request',
  'esri/map',
  'esri/dijit/Geocoder',
  'domReady!'
], function (
  lang,
  esriRequest,
  Map,
  Geocoder
) {
  function onConfigSuccess(response) {
    var map = new Map('map-div', response.options);
    map.on('load', function() {
      var geocoderOptions = lang.mixin(
        {
          map: map
        },
        response.geocoderOptions
      );
      console.debug(geocoderOptions);
      var geocoder = new Geocoder(geocoderOptions, 'search');
      geocoder.startup();
    });
  }
  function onConfigError(error) {
    console.log('ERROR - Loading config file:', error);
  }
  function requestParams() {
    return {
      url: 'config.json',
      handleAs: 'json'
    };
  }
  esriRequest(requestParams()).then(onConfigSuccess, onConfigError);
});
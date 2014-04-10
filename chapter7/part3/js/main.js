require([
  'dojo/_base/lang',
  'esri/request',
  'esri/map',
  'controllers/widgetloader',
  'domReady!'
], function (
  lang,
  esriRequest,
  Map,
  WidgetLoader
) {
  function onConfigSuccess(response) {
    var map = new Map('map-div', response.options);
    map.on('load', function() {
      var options = lang.mixin(
        {
          map: map
        },
        response
      );
      console.debug(options);
      var loader = new WidgetLoader(options);
      loader.startup();
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
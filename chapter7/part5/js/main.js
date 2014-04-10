require([
  'esri/request',
  'controllers/widgetloader',
  'domReady!'
], function (
  esriRequest,
  WidgetLoader
) {
  function onConfigSuccess(response) {
    var loader = new WidgetLoader(response);
    loader.startup();
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

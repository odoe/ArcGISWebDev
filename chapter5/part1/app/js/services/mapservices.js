/*global define*/
/*jshint laxcomma:true*/
define([
  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'utils/symbolUtil'
], function(FeatureLayer, SimpleRenderer, symbolUtil) {

  var CENSUS_URL = 'http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CensusLaborDemo/FeatureServer/1'
    , REQUEST_URL = 'http://services1.arcgis.com/QKasy5M2L9TAQ7gs/arcgis/rest/services/Requests/FeatureServer/0';

  function _loadServices(config) {
    var layers = []
    // census tract
      , censusLayer = new FeatureLayer(CENSUS_URL, {
        id: 'Census'
      })
      , requestLayer = new FeatureLayer(REQUEST_URL, {
        id: 'Requests',
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ['*']
      })
      // feature renderer
      , renderer = new SimpleRenderer(symbolUtil.renderSymbol());

    censusLayer.setRenderer(renderer);

    layers.push(censusLayer);
    layers.push(requestLayer);

    return layers;
  }

  return {
    loadServices: _loadServices
  };

});


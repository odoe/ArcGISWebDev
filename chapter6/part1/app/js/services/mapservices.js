/*jshint laxcomma:true*/
define([
  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'utils/symbolUtil'
], function(FeatureLayer, SimpleRenderer, symbolUtil) {

  function _loadServices(config) {
    var layers = []
      , censusLayer = new FeatureLayer(
          'http://services.arcgis.com/'+
          'V6ZHFr6zdgNZuVG0/arcgis/rest/services/'+
          'CensusLaborDemo/FeatureServer/1', {
            id: 'Census'
      })
      , requestLayer = new FeatureLayer(
          'http://services1.arcgis.com/'+
          'QKasy5M2L9TAQ7gs/arcgis/rest/services/'+
          'Requests/FeatureServer/0', {
            id: 'Requests',
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ['*']
      })
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


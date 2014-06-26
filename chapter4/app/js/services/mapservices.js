/*global define*/
/*jshint laxcomma:true*/
define([
  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'utils/symbolUtil'
], function(FeatureLayer, SimpleRenderer, symbolUtil) {

  function loadServices(config) {
    var layers = []
    // census tract
      , censusLayer = new FeatureLayer('http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CensusLaborDemo/FeatureServer/1')
    // feature renderer
      , renderer = new SimpleRenderer(symbolUtil.renderSymbol());

    censusLayer.setRenderer(renderer);

    layers.push(censusLayer);

    return layers;
  }

  return {
    loadServices: loadServices
  };

});

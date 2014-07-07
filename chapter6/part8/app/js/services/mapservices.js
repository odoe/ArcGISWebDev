/*global define*/
/*jshint laxcomma:true*/
define([
  'esri/layers/FeatureLayer',
  'utils/symbolutil'
], function(FeatureLayer, symbolUtil) {

  function _loadServices(config) {
    var layers = []
      , requestLayer
      , editLayer;

    requestLayer = new FeatureLayer('http://services1.arcgis.com/QKasy5M2L9TAQ7gs/arcgis/rest/services/Requests/FeatureServer/0', {
      id: 'Requests',
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ['*']
    });

    layers.push(requestLayer);

    return layers;
  }

  return {
    loadServices: _loadServices
  };
});


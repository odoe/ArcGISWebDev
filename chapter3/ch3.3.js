(function() {
  // dojo config stuff
  require({
    parseOnLoad:true
  });

  require([
    'dojo/dom-construct',
    'dojo/on',
    'esri/layers/FeatureLayer',
    'dojo/domReady!'
  ], function (domConstruct, on, FeatureLayer) {
    var map, featureLayer;

    map = new esri.Map('map', {
      basemap: 'gray',
      center: [-122.427, 37.769],
      zoom: 19
    });
    on(map, 'load', function (_map_) {
      featureLayer = new FeatureLayer('http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0', {
        mode: FeatureLayer.MODE_ONDEMAND
      });

      map.addLayer(featureLayer);
    });
  });

})();

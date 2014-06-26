require([
  'dojo/dom',
  'dojo/on',
  'esri/map',
  'esri/layers/FeatureLayer',
  'esri/toolbars/draw',
  'esri/tasks/query'
], function(dom, on, Map, FeatureLayer, Draw, Query) {
  var map = new Map('map', {
    basemap: 'streets',
    autoResize: true,
    center: [-118.2095, 34.0866],
    zoom: 10
  }),
  featureLayer = new FeatureLayer('http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/la_county_labor_centroid/FeatureServer/0', {
    mode: FeatureLayer.MODE_SELECTION
  }),
  drawToolbar = new Draw(map);

  on(drawToolbar, 'draw-end', function(evt){
    drawToolbar.deactivate();
    var query = new Query();
    query.geometry = evt.geometry;
    featureLayer.selectFeatures(query);
  });

  map.addLayer(featureLayer);

  on(dom.byId('drawPolygon'), 'click', function() {
    drawToolbar.activate(Draw.POLYGON);
  });

});


require([
  'esri/config',
  'esri/map',
  'esri/graphic',
  'esri/layers/FeatureLayer',
  'esri/toolbars/draw',
  'esri/tasks/GeometryService',
  'esri/tasks/BufferParameters',
  'esri/tasks/query',
  'esri/symbol',
  'dojo/on',
  'dojo/dom',
  'dojo/_base/Color',
  'dojo/_base/array',
  'dojo/domReady!'
], function (
  config, Map, Graphic, FeatureLayer,
  Draw, GeometryService, BufferParameters, Query,
  symbol, on, dom, Color, arrayUtil
) {
  config.defaults.io.proxyUrl = '/proxy/proxy.php';
  var map, geometryArray, geometryService, featureLayer, drawTool;
  map = new Map('map', {
    basemap: 'gray',
    center: [-118.20959546463835,34.28548773859569],
    zoom: 10
  });
  geometryArray = [];
  geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');
  featureLayer = new FeatureLayer('http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CT2010_pts/FeatureServer/0',{
    mode: FeatureLayer.MODE_SELECTION,
    outFields: ["*"] 
  });
  map.addLayer(featureLayer);
  map.on('load', function() {
    drawTool = new Draw(map);
    drawTool.on('draw-end', function(e) {
      drawTool.deactivate();
      var ptSymbol, params;
      ptSymbol = new symbol.SimpleMarkerSymbol(symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                                               10, null,
                                               new Color([255,0,0,1])
                                              );
      params = new BufferParameters();
      map.graphics.add(new Graphic(e.geometry, ptSymbol));
      params.geometries = [e.geometry];
      params.distances = [5];
      params.unit = GeometryService.UNIT_KILOMETER;
      params.outSpatialReference = map.spatialReference;
      geometryService.buffer(params, function(geometries) {
        console.log('buffered', geometries);
        var fill = new symbol.SimpleFillSymbol(
          symbol.SimpleFillSymbol.STYLE_SOLID,
          new symbol.SimpleLineSymbol(
            symbol.SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0,0.65]), 2
          ),
          new Color([255,0,0,0.35])
        );
        arrayUtil.forEach(geometries, function (geom) {
          geometryArray.push(geom);
          map.graphics.add(new Graphic(geom, fill));
        });
        if (geometryArray.length > 1) {
          intersectGeometries();
        }
      });
    });
  });
  function intersectGeometries() {
    var inputGeomertry = geometryArray[0],
    targetGeometry = geometryArray[1];
    geometryArray = [];
    geometryService.intersect([inputGeomertry], targetGeometry).then(function (geometries) {
      map.graphics.clear();
      var fill = new symbol.SimpleFillSymbol(
        symbol.SimpleFillSymbol.STYLE_SOLID,
        new symbol.SimpleLineSymbol(
          symbol.SimpleLineSymbol.STYLE_SOLID,
          new Color([211, 211, 211, 0.65]), 2
        ),
        new Color([255, 0, 0, 0.15])
      );
      arrayUtil.forEach(geometries, function (geom) {
        map.graphics.add(new Graphic(geom, fill));
      });
    });
  }
  on(dom.byId('drawPoint'), 'click', function() {
    drawTool.activate(Draw.POINT);
  });
});


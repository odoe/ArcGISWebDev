(function() {
    require([
        'esri/map',
        'esri/graphic',
        'esri/layers/FeatureLayer',
        'esri/toolbars/draw',
        'esri/tasks/GeometryService',
        'esri/tasks/BufferParameters',
        'esri/tasks/query',
        'esri/symbol',
        'dojo/query',
        'dojo/_base/Color',
        'dojo/_base/connect',
        'dojo/_base/array',
        'dojo/domReady!'
        ], function (Map, Graphic, FeatureLayer, Draw, GeometryService, BufferParameters, Query, symbol, query, Color, connect, array) {
            var map = new Map('map', {
                basemap: 'gray',
                center: [-122.4348, 37.7582],
                zoom: 13
            }),
            geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'),
            featureLayer = new FeatureLayer('http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/1',
                    {
                        mode: FeatureLayer.MODE_SELECTION,
                        outFields: ["*"] 
                    }),
            drawTool;

            map.addLayer(featureLayer);

            map.on('load', function() {
                drawTool = new Draw(map);
                connect.connect(drawTool, 'onDrawEnd', function(geometry) {
                    drawTool.deactivate();
                    var ptSymbol = new symbol.SimpleMarkerSymbol(symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                        10,
                        null,
                        new Color([255,0,0,1])),
                        params = new BufferParameters();

                    map.graphics.add(new Graphic(geometry, ptSymbol));

                    params.geometries = [geometry];
                    params.distances = [1];
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
                        array.forEach(geometries, function(geom) {
                            map.graphics.add(new Graphic(geom, fill));
                            var query = new Query();
                            query.geometry = geom;
                        });
                    });
                });
            });

            query('#drawPoint').on('click', function() {
                console.log('draw');
                drawTool.activate(Draw.POINT);
            });
        });

}).call(this);
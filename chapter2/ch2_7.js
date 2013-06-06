require([
        'dojo/_base/connect',
        'dojo/query',
        'esri/map',
        'esri/layers/FeatureLayer',
        'esri/toolbars/draw',
        'esri/tasks/query'
        ], function(connect, query, Map, FeatureLayer, Draw, Query) {
            var map = new Map('map', {
                basemap: 'streets',
                autoResize: true,
                center: [-118.2095, 34.0866],
                zoom: 10
            }),
            url = 'http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/la_county_labor_centroid/FeatureServer/0',
            featureLayer = new FeatureLayer('http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/la_county_labor_centroid/FeatureServer/0', {
                    mode: FeatureLayer.MODE_SELECTION
                }),
            drawToolbar = new Draw(map);

            connect.connect(drawToolbar, 'onDrawEnd', function(geometry){
                drawToolbar.deactivate();
                var query = new Query();
                query.geometry = geometry;
                featureLayer.selectFeatures(query);
            });

            map.addLayer(featureLayer);

            query('#drawPolygon').on('click', function() {
                drawToolbar.activate(Draw.POLYGON);
            });

        });

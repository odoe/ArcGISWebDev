require([
        'dojo/query',
        'dojo/_base/array',
        'dojo/_base/Color',
        'esri/map',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/symbols/SimpleMarkerSymbol'
        ], function(query, array, Color, Map, Query, QueryTask, SimpleMarkerSymbol) {
    var map = new Map('map', {
        basemap: 'streets',
        autoResize: true,
        center: [-118.2095, 34.0866],
        zoom: 10
    }),
    url = 'http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/la_county_labor_centroid/FeatureServer/0',
    markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, null, new Color([50,50,255]));

    function onQuerySuccess(featureSet) {
        map.graphics.clear();
        array.forEach(featureSet.features, function(feature) {
            feature.setSymbol(markerSymbol);
            map.graphics.add(feature);
        });
    }

    function onError(error) {
        console.error('An error ocurred in the query: ', error);
    }

    query('#population').on('change', function(e) {
        var population = e.target.selectedOptions[0].value;
        var queryTask = new QueryTask(url);
        var query = new Query();
        query.where = 'TOTAL_POP > ' + population;
        query.returnGeometry = true;
        queryTask.execute(query).then(onQuerySuccess, onError);
    });

});

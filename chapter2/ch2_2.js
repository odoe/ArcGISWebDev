require([
        'esri/map',
        'esri/graphic',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'dojo/_base/Color'
        ], function(Map, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, Color) {
    var map = new Map('map', {
        basemap: 'streets',
        autoResize: true,
        center: [-118.2095, 34.0866],
        zoom: 10
    });

    map.on('click', function(e) {
        var mapPoint = e.mapPoint,
            symbolSize = 24,
            lineColor = new Color([255, 0, 0]),
            fillColor = new Color([255, 255, 0, 0.75]),
            line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                lineColor, 3),
            sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
                symbolSize, line, fillColor),
            graphic = new Graphic(mapPoint, sms);
        map.graphics.add(graphic);
    });
});

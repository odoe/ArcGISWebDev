/*global define:true require:true console:true esri:true location:true*/
(function() {
    'use strict';

    var pathRX = new RegExp(/\/[^\/]+$/), locationPath = location.pathname.replace(pathRX, '');

    require({
        async: true,
        aliases: [['text', 'dojo/text']],
        packages: [{
            name: 'widgets',
            location: locationPath + 'js/widgets'
        }
        ]
    });

    require([
        'dojo/ready',
        'esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'widgets/legendtoc/LegendMenuWidget'
    ], function(ready, Map, ArcGISDynamicMapServiceLayer, LegendMenuWidget) {

        ready(function () {
            var visibleLayers = [1,2,3,4,5];

            var map = new Map('map', {
                basemap: 'gray',
                autoResize: true,
                center: [-118.2095, 34.0866],
                zoom: 10
            });

            var dynLayer = new ArcGISDynamicMapServiceLayer('http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer', {
                id: 'censusLayer'
            });
            dynLayer.setVisibleLayers(visibleLayers);
            dynLayer.title = 'Census'; // used for legend
            dynLayer.visibleLayers = visibleLayers; // used for legend
            map.addLayer(dynLayer);

            var options = {
                operational: [dynLayer]
            };

            LegendMenuWidget.create(options);
        });

    });

}).call(this);

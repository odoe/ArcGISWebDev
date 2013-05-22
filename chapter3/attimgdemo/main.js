/*
* Add attachment images through this sample: http://help.arcgis.com/en/webapi/javascript/arcgis/samples/ed_attachments/index.html
* And use this demo to view them in a popup
*/

(function() {
    // dojo config stuff
    require({
        parseOnLoad:true
    });

    require([
        'dojo/dom-construct',
        'dojo/_base/connect',
        'esri/dijit/Popup',
        'esri/layers/FeatureLayer',
        'dojo/domReady!'
        ], function (domConstruct, connect) {
            var map, popup, featureLayer;

            popup = new esri.dijit.Popup(null, domConstruct.create('div'));

            map = new esri.Map('map', {
                basemap: 'streets',
                center: [-122.427, 37.769],
                zoom: 19,
                infoWindow: popup
            });
            connect.connect(map, 'onLoad', function (_map_) {
                featureLayer = new esri.layers.FeatureLayer('http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0', {
                    mode: esri.layers.FeatureLayer.MODE_ONDEMAND
                    });
                connect.connect(featureLayer, 'onClick', function (e) {
                    var objectId, el;
                    objectId = e.graphic.attributes[featureLayer.objectIdField];
                    featureLayer.queryAttachmentInfos(objectId, function (infos) {
                        map.infoWindow.setTitle(objectId);
                        el = document.createElement('img');
                        if (!!infos[0].url) {
                            el.setAttribute('src', infos[0].url);
                            map.infoWindow.setContent(el);
                            map.infoWindow.show(e.screenPoint, map.getInfoWindowAnchor(e.screenPoint));
                        }

                    });
                });
                map.addLayer(featureLayer);
            });
        });

}).call(this);
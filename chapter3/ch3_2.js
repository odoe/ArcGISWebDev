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
        'esri/layers/FeatureLayer',
        'dojo/domReady!'
        ], function (domConstruct, connect) {
            var map, featureLayer;

            //popup = new esri.dijit.Popup(null, domConstruct.create('div'));

            map = new esri.Map('map', {
                basemap: 'gray',
                center: [-122.427, 37.769],
                zoom: 19
            });
            connect.connect(map, 'onLoad', function (_map_) {
                featureLayer = new esri.layers.FeatureLayer('http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0', {
                    mode: esri.layers.FeatureLayer.MODE_ONDEMAND
                    });
				/*
                connect.connect(featureLayer, 'onClick', function (e) {
                    var objectId, htmlpopupUrl, htmlRequest;
                    objectId = e.graphic.attributes[featureLayer.objectIdField];
                    htmlpopupUrl = featureLayer.url.concat('/').concat(objectId).concat('/').concat('htmlpopup');
                    htmlRequest = esri.request({
                        url: htmlpopupUrl,
                                content: {f:'json'},
                                handleAs: 'json',
                                callbackParamName: 'callback'
                    });
                    htmlRequest.then(function (response) {
                        var el, images, srcString;
                        el = document.createElement('div');
                        el.innerHTML = response.content;
                        images = el.getElementsByTagName('img');
                        for (var i = 0, len = images.length; i < len; i++) {
                            images[i].setAttribute('width', '34px');
                        }
                        map.infoWindow.setTitle(objectId);
                        map.infoWindow.setContent(el); // just add the DOM element
                        map.infoWindow.show(e.screenPoint, map.getInfoWindowAnchor(e.screenPoint));
                    });
                });
				*/

                map.addLayer(featureLayer);
            });
        });

}).call(this);

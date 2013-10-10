/*global define */
(function () {
  'use strict';

  define([
    'controllers/mapcontroller',
    'widgets/edit/editTools',
    'esri/toolbars/edit',
    'esri/dijit/editing/Editor',
    'esri/dijit/editing/TemplatePicker',
    'esri/config',
    'esri/IdentityManager'
  ], function (MapController, EditTools, Edit, Editor, TemplatePicker, esriConfig) {

    function mapLoaded(map) {
      console.debug('map has been loaded', map);
      /*
      var editTools = new EditTools({
        map: map
      }, 'map-tools');
     */

      var requestLayer = map.getLayer('Requests');
      console.debug('request layer', requestLayer);

      var widget = new TemplatePicker({
        featureLayers: [requestLayer],
        rows: "auto",
        columns: 1,
        showTooltip: true,
      }, "template-div");

      widget.startup();

        var settings = {
          map: map,
          templatePicker: widget,
          layerInfos:[ { 'featureLayer': requestLayer } ]
        };
        var params = {settings: settings};
        var editorWidget = new Editor(params);
        editorWidget.startup();


    }

    function _init(config) {

      esriConfig.defaults.io.proxy = '/proxy/proxy/php';

      var mapCtrl = new MapController(config);

      mapCtrl.load().then(mapLoaded);
    }

    return {
      init: _init
    };

  });
})();

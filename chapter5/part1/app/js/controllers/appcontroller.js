/*global define */
/*jshint laxcomma: true*/
define([
  'dojo/_base/array',
  'controllers/mapcontroller',
  'widgets/edit/editTools',
  'esri/toolbars/edit',
  'esri/dijit/editing/Editor',
  'esri/dijit/editing/TemplatePicker',
  'esri/config',
  'esri/IdentityManager'
], function (array, MapController, EditTools, Edit, Editor, TemplatePicker, esriConfig) {

  function mapLoaded(map) {
    //var editTools = new EditTools({
    //  map: map
    //}, 'map-tools');

    var requestLayer
      , layers = []
      , templatePicker;

    requestLayer = map.getLayer('Requests');

    layers.push(requestLayer);

    templatePicker = new TemplatePicker({
      featureLayers: layers,
      rows: 'auto',
      columns: 1,
    }, "template-div");

    templatePicker.startup();

    var layerInfos = array.map(layers, function(layer) {
      return {
        featureLayer: layer
      };
    });

    var settings = {
      map: map,
      templatePicker: templatePicker,
      layerInfos: layerInfos
    };
    var params = { settings: settings };
    var editorWidget = new Editor(params);
    //editorWidget.startup();
  }

  function _init(config) {

    //esriConfig.defaults.io.proxy = '/proxy/proxy/php';

    var mapCtrl = new MapController(config);

    mapCtrl.load().then(mapLoaded);
  }

  return {
    init: _init
  };

});

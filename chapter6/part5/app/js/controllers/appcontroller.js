/*global define */
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/event',
  'dojo/dom',
  'dojo/on',
  'esri/map',
  'esri/tasks/GeometryService',
  'esri/config',
  'esri/domUtils',
  'esri/dijit/Measurement',
  'esri/dijit/BasemapToggle',
  'esri/toolbars/edit',
  'utils/symbolutil'
], function (
  declare, lang, event,
  dom, on,
  Map,
  GeometryService,
  esriConfig,
  domUtils,
  Measurement, BasemapToggle,
  Edit,
  symbolUtil
) {

  var url = 'http://tasks.arcgisonline.com' +
    '/ArcGIS/rest/services/Geometry/GeometryServer';

  return declare(null, {
    map: null,
    options: {},

    constructor: function (options) {
      this.options = options;
      esriConfig.defaults.geometryService =
        new GeometryService(url);
    },

    load: function () {
      this.map = new Map(
        this.options.elem,
        this.options.mapOptions
      );

      on(this.map, 'load', lang.hitch(this, 'onMapLoad'));
      on(
        dom.byId('measurement-toggle'),
        'click',
        lang.hitch(this, 'toggleMeasurement')
      );
      this.map.addLayers(this.options.layers);
    },

    onMapLoad: function() {
      this.measurement = new Measurement({
        map: this.map
      }, 'measurement-div');
      domUtils.hide(dom.byId('measurement-div'));
     this. measurement.startup();

     this.basemaps = new BasemapToggle({
       map: this.map,
       basemap: 'hybrid'
     }, 'basemap-div');

     this.basemaps.startup();

     var layer = this.map.getLayer('Requests');
     var editToolbar = new Edit(this.map);
     var isEditing = false;
     var defaultSymbol;
     on(editToolbar, 'deactivate', function(e) {
       if (e.info.isModified) {
         e.graphic.setSymbol(defaultSymbol);
         layer.applyEdits(null, [e.graphic], null);
       }
     });
     on(layer, 'dbl-click', function(e) {
       event.stop(e);
       if (!isEditing) {
         isEditing = true;
         defaultSymbol = e.graphic.symbol;
         e.graphic.setSymbol(symbolUtil.selectedSymbol());
         editToolbar.activate(Edit.MOVE, e.graphic);
       } else {
         isEditing = false;
         editToolbar.deactivate();
       }
     });
    },

    toggleMeasurement: function(e) {
      e.preventDefault();
      domUtils.toggle(this.measurement.domNode);
    }
  });
});


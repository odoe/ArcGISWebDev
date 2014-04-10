/*global define*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',

  'dojo/Evented',
  'dojo/dom',
  'dojo/dom-construct',

  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'esri/arcgis/utils',

], function(
  declare, lang,
  Evented,
  dom, domConstruct,
  _WidgetBase, _TemplatedMixin,
  arcgisUtils
) {
  'use strict';

  return declare([_WidgetBase, _TemplatedMixin, Evented], {
    id: 'map-div',
    templateString: '<div></div>',
    constructor: function(options) {
      this.options = options;
      if (this.options.id) {
        this.id = this.options.id;
      }
    },

    postCreate: function() {
      var elem;
      if (this.options.target) {
        elem = dom.byId(this.options.target);
      } else {
        elem = document.body;
      }
      domConstruct.place(this.domNode, elem);
    },

    startup: function() {
      console.debug('options?', this.options);
      if (this.options.webmapid) {
        arcgisUtils.createMap(
          this.options.webmapid, this.id
        ).then(lang.hitch(this, '_mapCreated'));
      } else if (this.options.webmap) {
        arcgisUtils.createMap(
          this.options.webmap,
          this.id,
          {
            mapOptions: this.options.mapOptions
          }
        ).then(lang.hitch(this, '_mapCreated'));
      }
    },
    _mapCreated: function(response) {
      console.debug('map created, response?', response);
      var ol = response.itemInfo.itemData.operationalLayers;
      for (var i = 0; i < ol.length; i++) {
        var lyr = ol[i].layerObject.toJson();
        console.debug('featurelayer as json', lyr);
      }
      this.map = response.map;
      var params = { map: this.map };
      this.emit('map-ready', params);
    }
  });

});

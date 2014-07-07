/*global define */
define([
  'dojo/_base/declare',
  'esri/map'
], function (
  declare,
  Map
) {

  return declare(null, {
    map: null,
    options: {},

    constructor: function (options) {
      this.options = options;
    },

    load: function () {
      this.map = new Map(this.options.elem, this.options.mapOptions);
      this.map.addLayers(this.options.layers);
    }
  });
});


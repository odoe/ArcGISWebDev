/*global define */
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/Deferred',
  'esri/map'
], function (declare, lang, on, Deferred, Map) {

  return declare(null, {
    map: null,
    options: {},

    constructor: function(options) {
      this.options = lang.mixin(this.options, options);
      console.debug('options?', this.options);
    },

    // public methods
    load: function() {
      var deferred = new Deferred()
        , layersAdded = lang.hitch(this, function(layers) {
      deferred.resolve(this.map);
        });

        this.map = new Map(this.options.elem, this.options.mapOptions);

        on.once(this.map, 'layers-add-result', layersAdded);

        this.map.addLayers(this.options.layers);

        return deferred.promise;
    }
  });

});

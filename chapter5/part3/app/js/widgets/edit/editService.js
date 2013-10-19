/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global define*/
(function() {
  'use strict';

  define([
    'dojo/_base/declare',
    'dojo/request'
  ], function(declare, request) {

    return declare(null, {
      layer: null,

      constructor: function(options) {
        declare.safeMixin(this, options);
      },

      add: function(adds) {
        this._adds = adds;
        request('//' + window.location.hostname +
                '/?rand=' +
                Math.floor((1 + Math.random()) * 0x10000))
          .then(lang.hitch(this, function() { // save
            return this.layer.applyEdits(adds);
          }),
          lang.hitch(this, function() { // to local
            console.debug('save to local storage');
          }));
      },

      _success: function() {},

      _error: function() {}

    });

  });

})();

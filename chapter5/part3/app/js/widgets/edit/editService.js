/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global define*/
/*jshint laxcomma:true*/
(function() {
  'use strict';

  define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/Deferred',
    'dojo/request',
    'dojo/json',
    'esri/graphic'
  ], function(declare, lang, Deferred, request, dojoJson, Graphic) {

    return declare(null, {
      layer: null,
      hasLocal: false,

      constructor: function(options) {
        declare.safeMixin(this, options);
        this._adds = [];
        this._sync = [];
        this.check();
      },

      check: function() {
        for (var name in window.localStorage) {
          if (name.indexOf('request') > -1) {
            this.hasLocal = true;
          }
        }
      },

      sync: function() {
        for (var name in window.localStorage) {
          if (name.indexOf('request') > -1) {
            var item = window.localStorage.getItem(name);
            var graphic = new Graphic(dojoJson.parse(item));
            this._sync.push(graphic);
          }
        }
        if (this._sync.length > 0) {
          console.debug('saved locally', this._sync);
          this.layer.applyEdits(this._sync)
            .then(
              lang.hitch(this, function() {
                this._sync.length = 0;
                this.hasLocal = false;
                window.localStorage.removeItem(name);
              }),
              lang.hitch(this, function() {
                this._sync.length = 0;
              })
            );
        }
      },

      add: function(adds) {
        var deferred = new Deferred()
          , req;
        req = this.layer.applyEdits(adds);
        req.then(
          function() {
            deferred.resolve();
          },
          function() {
            console.debug('save to local storage');
            for (var i = 0, item; (item = adds[i]); i++) {
              try {
                var id = Math.floor(1 + Math.random() * 1000);
                window.localStorage.setItem('request-' + id, dojoJson.stringify(item.toJson()));
              } catch (error) {
                console.debug('Problem adding tile to local storage. Storage might be full');
              }
            }
            deferred.reject();
          }
        );

        return deferred.promise;
      },

      _success: function() {},

      _error: function() {}

    });

  });

})();

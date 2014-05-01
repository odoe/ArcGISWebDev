/*global define*/
/*jshint laxcomma:true*/
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
      console.debug('what are opts?', options);
      this.options = options || {};
      this.layer = options.layer;
      this._sync = [];
      this.check();
    },

    check: function() {
      for (var name in localStorage) {
        if (name.indexOf('request') > -1) {
          this.hasLocal = true;
        }
      }
    },

    sync: function() {
      var keys = [];
      for (var key in window.localStorage) {
        if (key.indexOf('request') > -1) {
          keys.push(key);
          var item = localStorage.getItem(key);
          var graphic = new Graphic(dojoJson.parse(item));
          this._sync.push(graphic);
        }
      }
      if (this._sync.length > 0) {
        this.layer.applyEdits(this._sync)
          .then(
            lang.hitch(this, function() {
              this._sync.length = 0;
              this.hasLocal = false;
              for (var i = 0, key; (key = keys[i]); i++) {
                console.log('key to remove', key);
                localStorage.removeItem(key);
              }
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
        lang.hitch(this,
                    function() {
                      for (var i = 0, item; (item = adds[i]); i++) {
                        try {
                          var id = Math.floor(1 + Math.random() * 1000);
                          var requestItem = localStorage.getItem('request-' + id);
                          if (!requestItem) {
                            localStorage.setItem('request-' +
                                                        id, dojoJson.stringify(item.toJson()));
                          }
                          this.check();
                        } catch (error) {
                          alert('Problem adding request to local storage. Storage might be full');
                        }
                      }
                      deferred.reject(adds);
                    })
      );

      return deferred.promise;
    },

    _success: function() {},

    _error: function() {}

  });

});


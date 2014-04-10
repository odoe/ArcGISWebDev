/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Deferred',
  'esri/graphic',
  'stores/pouchstore'
], function(
  declare, lang, arrayUtils,
  Deferred,
  Graphic,
  PouchStore
) {

  return declare(null, {
    layer: null,
    hasLocal: false,

    constructor: function(options) {
      declare.safeMixin(this, options);
      this.map = options.map;
      this._sync = [];
      this.store = new PouchStore('request');
      this.check();
    },

    check: function() {
      this.store.getAll().then(lang.hitch(this, '_onStoreChecked'));
    },

    _onStoreChecked: function(response) {
      if (response.length) {
        this.hasLocal = true;
        response.forEach(lang.hitch(this, function(data) {
          var graphic = new Graphic(data.doc.item);
          this.map.graphics.add(graphic);
        }));

      }
    },

    sync: function() {
      this.store.getAll().then(lang.hitch(this, '_onGetAll'));
    },
    add: function(adds) {
      var deferred = new Deferred()
        , req;
      req = this.layer.applyEdits(adds);
      req.then(
        function() {
        deferred.resolve();
      },
      lang.hitch(
          this,
          function() {
            arrayUtils.forEach(adds, function(graphic) {
              this.store.add(graphic.toJson());
              this.hasLocal = true;
            }, this);
            deferred.reject(adds);
          }
        )
      );

      return deferred.promise;
    },
    _onGetAll: function(response) {
      if (response.length) {
        this._sync = response.map(function(data) {
          return new Graphic(data.doc.item);
        });

        if (this._sync.length) {
          this.layer.applyEdits(this._sync).then(
            lang.hitch(this, '_dataSynced'),
            lang.hitch(this, '_syncError')
          );
        }
      }
    },
    _dataSynced: function() {
      this._sync.length = 0;
      this.hasLocal = false;
      this.store.removeAll();
      this.map.graphics.clear();
      this.layer.refresh();
    },
    _syncError: function() {
      this._sync.length = 0;
    }
  });
});

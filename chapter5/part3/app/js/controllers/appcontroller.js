/*global define */
/*jshint laxcomma: true*/
define([
  'dojo/_base/array',
  'controllers/mapcontroller',
  'widgets/edit/editTools',
  'esri/IdentityManager'
], function (array, MapController, EditTools) {

  function mapLoaded(map) {
    var editTools = new EditTools({
      map: map
    }, 'map-tools');
  }

  function _init(config) {

    var mapCtrl = new MapController(config);

    mapCtrl.load().then(mapLoaded);
  }

  return {
    init: _init
  };

});

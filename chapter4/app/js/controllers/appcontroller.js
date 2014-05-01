/*global define */
define([
  'controllers/mapcontroller',
  'widgets/edit/editTools'
], function (MapController, EditTools) {

  function mapLoaded(map) {
    console.debug('map has been loaded', map);
    var editTools = new EditTools({
      map: map
    }, 'map-tools');
  }

  function init(config) {

    var mapCtrl = new MapController(config);

    mapCtrl.load().then(mapLoaded);
  }

  return {
    init: init
  };

});

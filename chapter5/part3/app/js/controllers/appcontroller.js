/*global define */
/*jshint laxcomma: true*/
(function () {
  'use strict';

  define([
    'dojo/_base/array',
    'controllers/mapcontroller',
    'widgets/edit/editTools',
    'esri/IdentityManager'
  ], function (array, MapController, EditTools, Edit, Editor, TemplatePicker) {

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
})();

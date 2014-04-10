/*global define*/
define([
  'esri/request'
], function(
  esriRequest
) {
  'use strict';

  return {
    getEmployees: function() {
      return esriRequest({
        url: 'data/data.json',
        handleAs: 'json',
        callbackParamName: 'callback'
      });
    }
  };

});

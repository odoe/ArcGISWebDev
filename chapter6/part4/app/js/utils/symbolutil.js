/*global define*/
define([
  'dojo/_base/Color',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol'
], function(Color, SimpleFillSymbol, SimpleLineSymbol) {
  'use strict';

  return {
    renderSymbol: function() {
      return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                  // outline of symbol
                                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1),
                                  // color of fill
                                  new Color([128,128,128, 0.5]));
    }
  };

});


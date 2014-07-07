/*global define*/
define([
  'dojo/_base/Color',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol'
], function(
  Color,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol
) {
  'use strict';

  return {
    renderSymbol: function() {
      return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                  // outline of symbol
                                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1),
                                  // color of fill
                                  new Color([128,128,128, 0.5]));
    },
    selectedSymbol: function() {
      return new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 24,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH,
                            new Color([0,0,255]), 2),
        new Color([0,255,255,0.5])
      );
    }
  };

});


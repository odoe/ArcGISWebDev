/*global define */
/*jshint laxcomma:true*/
define([
  'require',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array'
], function(
  require,
  declare, lang, arrayUtil
) {
  return declare([], {
    constructor: function(options) {
      this.options = options;
    },
    startup: function() {
      arrayUtil.forEach(
        this.options.widgets,
        this._widgetLoader,
        this
      );
    },
    _widgetLoader: function(widget) {
      lang.mixin(widget.options, this.options);
      this._requireWidget(widget);
    },
    _requireWidget: function(widget) {
      require([widget.path], function(Widget) {
        var w = new Widget(widget.options, widget.node);
        w.startup();
      });
    }
  });
});
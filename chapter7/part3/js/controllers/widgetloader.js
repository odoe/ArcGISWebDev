/*global define */
/*jshint laxcomma:true*/
define([
  'require',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',

  'dojo/dom',
  'dojo/dom-construct'
], function(
  require,
  declare, lang, arrayUtils,
  dom, domConstruct
) {

  function target(opt) {
    return opt.target || document.body;
  }

  function domNode(opt) {
    return domConstruct.create('div', {
      id: opt.node
    });
  }

  function targetElem(domTarget) {
    if (domTarget === document.body) {
      return domTarget;
    } else {
      return dom.byId(domTarget);
    }
  }

  return declare(null, {
    constructor: function(options) {
      this.options = options;
    },
    startup: function() {
      arrayUtils.forEach(
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
        var node, w;
        if (widget.node) {
          node = domNode(widget);
          domConstruct.place(node, targetElem(target(widget)));
        }
        w = new Widget(widget.options, widget.node);
        w.startup();
      });
    }
  });
});

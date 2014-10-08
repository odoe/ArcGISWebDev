/*global define */
/*jshint laxcomma:true*/
define([
  'require',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',

  'dojo/Deferred',
  'dojo/on',
  'dojo/dom',
  'dojo/dom-construct',
    
  'dijit/_WidgetBase'
], function(
  require,
  declare, lang, arrayUtils,
  Deferred,
  on, dom, domConstruct,
  _WidgetBase
) {

  function arrange(arr) {
    var mapwidget
      , widgets = [];
    arrayUtils.forEach(arr, function(item) {
      if (item.type === 'map') {
        mapwidget = item;
      } else {
        widgets.push(item);
      }
    });
    return {
      mapwidget: mapwidget,
      widgets: widgets
    };
  }

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

  return declare([_WidgetBase], {
    constructor: function(options) {
      this.options = options;
    },
    startup: function() {
      var filtered = arrange(this.options.widgets);
      this.widgets = filtered.widgets;
      this._requireWidget(filtered.mapwidget)
        .then(lang.hitch(this, '_mapWidgetLoaded'));
    },
    _mapWidgetLoaded: function(mapWidget) {
      this.own(
        on.once(mapWidget, 'map-ready', lang.hitch(this, '_mapReady'))
      );
    },
    _mapReady: function(params) {
      if (this.widgets.length > 0) {
        arrayUtils.forEach(this.widgets, function(widget) {
          lang.mixin(widget.options, params);
          this._requireWidget(widget);
        }, this);
      }
    },
    _requireWidget: function(widget) {
      var deferred = new Deferred();
      require([widget.path], function(Widget) {
        var node, w;
        if (widget.node) {
          node = domNode(widget);
          domConstruct.place(node, targetElem(target(widget)));
        }
        w = new Widget(widget.options, node);
        deferred.resolve(w);
        w.startup();
      });
      return deferred.promise;
    }
  });
});

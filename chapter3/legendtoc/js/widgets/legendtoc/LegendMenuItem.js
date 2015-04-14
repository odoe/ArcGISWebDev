define([
  'dojo/_base/declare',
  'dijit/MenuItem',
  'text!widgets/legendtoc/templates/LegendMenuItem.tpl.html',
  'dijit/hccss'
], function(declare, MenuItem, template) {

    //http://bugs.dojotoolkit.org/ticket/16177

    /**
      * Extends dijit.MenuItem for use in LegendToc
      * @constructor
      */
    var LegendMenuItem = declare([MenuItem], {
        templateString: template,
        legendUrl: ''
    });

    return LegendMenuItem;

});

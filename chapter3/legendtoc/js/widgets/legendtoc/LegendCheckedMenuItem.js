    define([
        'dojo/_base/declare',
        'dijit/CheckedMenuItem',
        'text!widgets/legendtoc/templates/LegendCheckedMenuItem.tpl.html',
        'dijit/hccss'
        ], function(declare, CheckedMenuItem, template) {
            /**
             * Extends dijit.CheckedMenuItem.
             * Requires a customized template html file.
             * @constructor
             */
            var LegendCheckedMenuItem = declare([CheckedMenuItem], {
                templateString: template,
                legendUrl: ''
            });

            return LegendCheckedMenuItem;
        });

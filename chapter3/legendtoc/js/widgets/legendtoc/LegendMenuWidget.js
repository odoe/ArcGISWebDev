/*global define esri console document*/
(function () {
    'use strict';

    define([
        'dojo/_base/declare',
        'dojo/_base/array',
        'dojo/Evented',
        'dijit/Menu',
        'dijit/MenuBar',
        'dijit/PopupMenuBarItem',
        'esri/request',
        'widgets/legendtoc/LegendMenuItem',
        'widgets/legendtoc/LegendCheckedMenuItem',
        'widgets/legendtoc/CheckedPopupMenuItem'
    ], function (declare, array, Evented, Menu, MenuBar, PopupMenuBarItem, esriRequest, LegendMenuItem, LegendCheckedMenuItem, CheckedPopupMenuItem) {

        /**
         * Build a dijit.Menu of Legend items in a Layer item
         * @type Function
         * @param {esri/layers/LayerInfo} info
         * @param {Array} legend
         * @return {dijit/Menu}
         * @private
         */
        function buildLegendMenu(legend) {
            var legendMenu = new Menu({});
            array.forEach(legend, function(item) {
                legendMenu.addChild(new LegendMenuItem({
                    label: item.label.length > 0 ? item.label : '...',
                    legendUrl: 'data:image/png;base64,' + item.imageData
                }));
            });
            return legendMenu;
        }

        // This section handles layers that have a parentLayerId (part of a grouped layer)
        function handleGroupedLayers(checked, info, visible) {
            var parentId = info.parentLayerId,
                index = array.indexOf(visible, parentId);
            if (!checked && parentId > -1 && index > -1) {
                visible.splice(index, 1);
            } else if (checked && parentId > -1 && index > -1) {
                visible[visible.length] = parentId;
            }
            return visible;
        }

        function handleSubLayers(info, visible) {
            var hasParent = true,
                index;

            array.forEach(info.subLayerIds, function(subId) {
                index = array.indexOf(visible, subId);
                hasParent = index < 0;
                if (!hasParent) {
                    visible.splice(index, 1);
                } else {
                    visible[visible.length] = subId;
                }
            });

            if (!hasParent) {
                index = array.indexOf(visible, info.id);
                if (index > -1) {
                    visible.splice(index, 1);
                }
            }
            return visible;
        }

        /**
         * Response handler for esri/request to Legend REST Url
         * @type Function
         * @param {esri/layers/Layer} layer
         * @param {dijit/Menu} lyrMenu
         * @return {Function}
         * @private
         */
        function legendResponseHandler(layer, lyrMenu) {
            var onChecked = function (checked) {
                var visible = layer.visibleLayers,
                    _id = this.info.layerId || this.info.id,
                    index = array.indexOf(visible, _id);
                if (index > -1) {
                    visible.splice(index, 1);
                } else {
                    visible.push(_id);
                }

                visible = handleGroupedLayers(checked, this.info, visible);

                // This section checks if a layer has subLayers and turns them off
                if (this.info.subLayerIds) {
                    visible = handleSubLayers(this.info, visible);
                }

                layer.setVisibleLayers(visible.length > 0 ? visible : [-1]);
            };

            // return the promise function
            return function (response) {
                var lyrs = response.layers,
                    subIds = [];

                function fromLayersResponse(_id) {
                    for (var x = 0, len = lyrs.length; x < len; x++) {
                        if (lyrs[x].layerId === _id) return lyrs[x];
                    }
                    return null;
                }

                function addLegendMenuItem(layer, subInfo, grpMenu) {
                    var info = fromLayersResponse(subInfo.id);
                    if (info) {
                        grpMenu.addChild(new LegendCheckedMenuItem({
                            label: info.layerName,
                            info: subInfo,
                            legendUrl: 'data:image/png;base64,' + info.legend[0].imageData,
                            checked: array.indexOf(layer.visibleLayers, info.layerId) > -1,
                            onChange: onChecked
                        }));
                    }
                    return grpMenu;
                }

                function buildGroupMenu(subLayers) {
                    var groupMenu = new Menu({});
                    array.forEach(subLayers, function(sub) {
                        var subInfo = layer.layerInfos[sub];
                        subIds.push(sub);
                        groupMenu = addLegendMenuItem(layer, subInfo, groupMenu);
                    });
                    return groupMenu;
                }

                array.forEach(layer.layerInfos, function(info) {
                    var sub_info,
                        responseLayer = fromLayersResponse(info.id);

                    if (info.subLayerIds) { // handle grouped layers. Group layers suck.
                        var groupMenu = buildGroupMenu(info.subLayerIds);

                        lyrMenu.addChild(new CheckedPopupMenuItem({
                            label: info.name,
                            info: info,
                            popup: groupMenu,
                            checked: array.indexOf(layer.visibleLayers, info.id) > -1,
                            onChange: onChecked
                        }));

                    } else if (responseLayer && responseLayer.legend.length > 1 && subIds.indexOf(info.id) < 0) {
                        sub_info = fromLayersResponse(info.id);
                        // make a regular menu and normal menu items to legend
                        if (sub_info) {
                            var legendMenu = buildLegendMenu(sub_info.legend);
                            lyrMenu.addChild(new CheckedPopupMenuItem({
                                label: sub_info.layerName,
                                info: info,
                                popup: legendMenu,
                                checked: array.indexOf(layer.visibleLayers, sub_info.layerId) > -1,
                                onChange: onChecked
                            }));
                        }
                    } else if (subIds.indexOf(info.id) < 0) {
                        // make a checked menu item
                        sub_info = fromLayersResponse(info.id);
                        if (sub_info) {
                            lyrMenu.addChild(new LegendCheckedMenuItem({
                                label: sub_info.layerName,
                                info: sub_info,
                                legendUrl: 'data:image/png;base64,' + sub_info.legend[0].imageData,
                                checked: array.indexOf(layer.visibleLayers, sub_info.layerId) > -1,
                                onChange: onChecked
                            }));
                        }
                    }
                });
            };

        }

        function addLegend(menubar) {
            var node = document.createElement('li'),
                tools_menu = document.getElementById('tools-menu');
            node.classList.add('toc-menu');
            if (tools_menu) {
                tools_menu.appendChild(node);
                menubar.placeAt(node).startup(); // root of the menu bar
            }
        }

        /**
         * LegendMenuWidget that can display given layers in a pure Dojo menu
         * with Checkboxes
         * @constructor
         */
        var LegendMenuWidget = declare([Evented], {

            /**
             * Startup function for Widget
             * @param {Array} options
             */
            startup: function (options) {
                var tocMenu = new Menu({}),
                    menuBar = new MenuBar({}), // root of the menu bar
                    layers = options.operational || [],
                    onServiceChecked = function (checked) {
                        this.layer.setVisibility(checked);
                    };

                array.forEach(layers, function(layer) {
                    var lyrMenu = new Menu({}),
                        serviceMenu = new CheckedPopupMenuItem({
                            label: layer.title,
                            layer: layer,
                            checked: layer.visible,
                            popup: lyrMenu,
                            onChange: onServiceChecked
                        });

                    // use esri.request to get Legend Information for current layer
                    esriRequest({
                        url: layer.url + '/legend',
                        content: {
                            f: 'json'
                        },
                        callbackParamName: 'callback'
                    }).then(legendResponseHandler(layer, lyrMenu));
                    tocMenu.addChild(serviceMenu);
                });

                menuBar.addChild(new PopupMenuBarItem({
                    label: '<span class="lgnd-lbl">Layers</span>',
                    popup: tocMenu
                }));
                addLegend(menuBar);

                return this;
            }
        });

        // widget factory
        return {
            create: function (options) {
                return new LegendMenuWidget().startup(options);
            }
        };

    });

}).call(this);

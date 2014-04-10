/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/event',
  'dojo/dom-construct',
  'dojo/on',
  'dojo/Deferred',
  'esri/layers/FeatureLayer',
  'esri/tasks/query',
  'esri/toolbars/edit',
  'esri/dijit/AttributeInspector',
  'utils/editconfig',
  'utils/symbolutil',
  'services/employeeservice'
], function(
  declare, lang, arrayUtil, event,
  domConstruct, on, Deferred,
  FeatureLayer, Query,
  Edit,
  AttributeInspector, editConfig,
  symbolUtil,
  employeeService
) {
  'use strict';

  return declare([], {

    map: null,
    editLayer: null,
    attrLayer: null,
    editToolbar: null,
    isEditing: false,
    attrInspector: null,
    editFeature: null,

    constructor: function(options) {
      this.map = options.map;
      this.editLayer = options.editLayer;
    },

    init: function() {

      var editLayer
        , layerInfos;

      editLayer = this.editLayer;

      this.attrLayer = new FeatureLayer(editLayer.url, {
        id: 'RequestsEdit',
        mode: FeatureLayer.MODE_SELECTION,
        outFields: ['*']
      });

      this.editToolbar = new Edit(this.map);

      on(this.editToolbar, 'deactivate', lang.hitch(this,'onEditDeactivate'));
      on(this.map, 'click', lang.hitch(this, 'onMapClick'));
      on(this.editLayer, 'dbl-click', lang.hitch(this, 'onMoveFeature'));
      on(this.map.infoWindow, 'hide', lang.hitch(this, 'clear'));

      if (!this.attrLayer.loaded) {
        on(this.attrLayer, 'load', lang.hitch(
          this,
          function() {
            this.updateFields(this.attrLayer).then(
              lang.hitch(this, 'onFieldsReady')
            );
          }
        ));
      }

    },

    onFieldsReady: function(fieldInfos) {
      var layerInfos = [{
        featureLayer: this.attrLayer,
        isEditable: true,
        showDeleteButton: false,
        fieldInfos: fieldInfos
      }];

      this.attrInspector = new AttributeInspector({
        layerInfos: layerInfos
      }, domConstruct.create('div'));

      on(this.attrInspector,
         'attribute-change',
         lang.hitch(this, 'onAttributesChange')
        );

      this.map.infoWindow.setContent(this.attrInspector.domNode);
      this.map.infoWindow.resize(400, 350);
    },

    onMoveFeature: function(e) {
      event.stop(e);
      if (!this.isEditing) {
        this.isEditing = true;
        this.defaultSymbol = e.graphic.symbol;
        e.graphic.setSymbol(symbolUtil.selectedSymbol());
        this.editToolbar.activate(Edit.MOVE, e.graphic);
      } else {
        this.isEditing = false;
        this.editToolbar.deactivate();
      }
    },

    onEditDeactivate: function(e) {
      if (e.info.isModified) {
        e.graphic.setSymbol(this.defaultSymbol);
        this.editLayer.applyEdits(null, [e.graphic], null);
      }
    },

    onMapClick: function(e) {
      if (!this.isEditing && e.graphic) {
        var query = new Query();
        query.objectIds = [e.graphic.attributes.OBJECTID];
        this.attrLayer.selectFeatures(query)
          .then(lang.hitch(this, function(features) {
            if (features.length) {
              this.editFeature = features[0];
              this.map.infoWindow.setTitle(this.attrLayer.name);
              this.map.infoWindow.show(
                e.screenPoint,
                this.map.getInfoWindowAnchor(e.screenPoint)
              );
            } else {
              this.map.infoWindow.hide();
            }
          }));
      }
    },

    onAttributesChange: function(e) {
      this.editFeature.attributes[e.fieldName] = e.fieldValue;
      this.attrLayer.applyEdits(null, [this.editFeature], null);
    },

    clear: function() {
      this.attrLayer.clearSelection();
    },

    updateFields: function(layer) {
      var deferred = new Deferred();
      employeeService.getEmployees().then(function(data) {
        var fieldInfo
          , codedValues;

        codedValues = arrayUtil.map(
          data.employees,
          function(employee) {
            return {
              name: employee.name,
              code: employee.id
            };
          }
        );

        fieldInfo = {
          fieldName: 'Assignee',
          isEditable: true,
          label: 'Assigned To',
          domain: {
            type: 'codedValue',
            name: 'employeeDomain',
            codedValues: codedValues
          }
        };

        editConfig.fieldInfos.push(fieldInfo);

        arrayUtil.forEach(layer.fields, function(field) {
          arrayUtil.forEach(editConfig.fieldInfos, function(info) {
            if (field.name === info.fieldName) {
              field.domain = info.domain;
            }
          });
        });

        deferred.resolve(editConfig.fieldInfos);

      });
      return deferred.promise;
    }
  });

});


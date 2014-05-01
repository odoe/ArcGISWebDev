/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  // Dijit stuff
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  // dom stuff
  'dojo/dom-class',
  // template
  'text!widgets/edit/editTools.tpl.html',
], function(declare, lang, array, _WidgetBase, _TemplatedMixin, domClass, template) {

  return declare([_WidgetBase, _TemplatedMixin], {

    declaredClass: 'widgets.edit.EditTools',

    templateString: template,

    options: {},

    editing: false,

    map: null,

    // lifecycle 1
    constructor: function(options) {

      // mix in settings and defaults
      this.options = options || {};
      this.map = this.options.map;
    },

    // start widget
    startup: function() {
      this._init();
    },

    // cleanup
    destroy: function() {
      // default destroy
      this.inherited(arguments);
    },

    // public methods

    // widget methods
    _addRequest: function() {
      console.debug('editTools#_addRequest: start or stop adding a request.');
      this.editing = !this.editing;
      this._toggleEditButton();
    },

    // private functions
    _init: function() {
    },

    _toggleEditButton: function() {
      if(this.editing) {
        this.editNode.innerHTML = 'Adding Request';
      } else {
        this.editNode.innerHTML = 'Add Request';
      }
      domClass.toggle(this.editNode, 'btn-primary btn-success');
    }

  });

});

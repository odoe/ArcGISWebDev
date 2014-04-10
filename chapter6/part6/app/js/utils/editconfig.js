/*global define*/
define([
], function() {
  'use strict';

  return {
    fieldInfos: [{
      fieldName:'IssueType',
      isEditable: true,
      label: 'Issue Type',
      domain: {
        type: 'codedValue',
        name: 'issueTypeDomain',
        codedValues: [{
          name: 'Graffiti',
          code: 'graffiti'
        }, {
          name: 'Street Light',
          code: 'streetlight'
        }, {
          name: 'Pothole',
          code: 'pothole'
        }, {
          name: 'Other',
          code: 'other'
        }]
      }
    }, {
      fieldName: 'Description',
      isEditable: true,
      label: 'Description'
    }]
  };
});

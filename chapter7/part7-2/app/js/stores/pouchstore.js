/*global define, alert */
/*jshint browser:true, laxcomma:true, newcap:false*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/store/util/QueryResults'
], function (
  declare, lang,
  Deferred,
  QueryResults
) {

  return declare(null, {

    database: null,
    _db: null,

    constructor: function (database) {
      this.database = database;
      this._init();
    },

    add: function (object) {
      var deferred = new Deferred();
      this._db.put({
        _id: new Date().toISOString(),
        item: object
      }, function (err, result) {
        if (!err) {
          deferred.resolve(result);
        } else {
          alert('Error saving item locally: ' + err.message);
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    getAll: function () {
      var deferred = new Deferred();
      this._db.allDocs({ include_docs: true }, function (err, response) {
        if (!err) {
          deferred.resolve(response.rows);
        } else {
          alert('Error retrieving local data: ' + err.message);
          deferred.reject(err);
        }
      });
      return QueryResults(deferred.promise);
    },

    removeAll: function() {
      this.getAll().then(lang.hitch(this, function(response) {
        response.forEach(lang.hitch(this, function(data) {
          this._db.remove(data.doc);
        }));
      }));
    },

    _init: function () {
      this._db = new window.PouchDB(this.database);
    }
  });
});

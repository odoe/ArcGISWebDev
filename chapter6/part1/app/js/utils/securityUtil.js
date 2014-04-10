/*global window, define*/
/*jshint laxcomma:true*/
define([
  'dojo/Deferred',
  'dojo/json',
  'esri/kernel',
  'dojo/cookie'
], function(
  Deferred, dojoJSON,
  kernel, cookie
) {
  'use strict';

  var key = 'esri_js_creds'
    , hasLocal = window.localStorage !== null;

  function loadCredentials() {
    var credJson
      , deferred;

    deferred = new Deferred();

    if (hasLocal) {
      credJson = window.localStorage.getItem(key);
    } else {
      credJson = cookie(key);
    }

    if (credJson) {
      kernel.id.initialize(dojoJSON.parse(credJson));
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }

    return deferred.promise;
  }

  function saveCredentials() {
    var deferred = new Deferred();

    if (kernel.id.credentials.length === 0) {
      deferred.resolve(false);
    }

    var credId = dojoJSON.stringify(kernel.id.toJson());

    if (hasLocal) {
      window.localStorage.setItem(key, credId);
      deferred.resolve(true);
    } else {
      cookie(key, credId, { expires: 1 });
      deferred.resolve(true);
    }

    return deferred.promise;
  }

  function removeCredentials() {
    var deferred = new Deferred();
    if (hasLocal) {
      window.localStorage.removeItem(key);
      deferred.resolve(true);
    } else {
      var credId = dojoJSON.stringify(kernel.id.toJson());
      cookie(key, credId, { expires: -1 });
      deferred.resolve(true);
    }
    return deferred.promise;
  }

  return {
    loadCredentials: loadCredentials,
    saveCredentials: saveCredentials,
    removeCredentials: removeCredentials
  };

});

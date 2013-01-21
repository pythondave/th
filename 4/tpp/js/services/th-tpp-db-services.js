/*
    services:
        localStorageService - service for saving stuff locally
*/

angular.module('tpp').
  service('localStorageService', function() { ////*** TODO - streamline the stringify stuff; move the service to something more generic
    var storage, storageType;
    try {
      storage = localStorage;
      storageType = 'local';
    } catch (e) {
      storage = sessionStorage; //fallback if localStorage isn't working (which it doesn't seem to be with IE10)
      storageType = 'session';
    }
    var prefix = 'tpp.';
    
    return {
      storageType: storageType,
      setItem: function(key, value) {
        storage.setItem(prefix+key, JSON.stringify(value));
      },
      getItem: function(key) {
        var storedValue = storage.getItem(prefix+key);
        var object = JSON.parse(storedValue);
        return object;
      },
      removeAllItems: function() {
        for (var key in storage) {
          if (key.substr(0, prefix.length) === prefix) { // remove any item which starts with the prefix
            storage.removeItem(key);
          }
        };
      }
    }
  });
  
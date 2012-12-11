/*
    services:
        localStorageService - service for saving stuff locally
*/

angular.module('tpp').
    service('localStorageService', function() { ////*** TODO - streamline the stringify stuff; move the service to something more generic
        return {
            prefix: 'tpp1' + '.',
            setItem: function(key, value) {
                localStorage.setItem(this.prefix+key, JSON.stringify(value));
            },
            getItem: function(key) {
                var storedValue = localStorage.getItem(this.prefix+key);
                try {
                    var object = JSON.parse(storedValue);
                    return object;
                } catch (e) {
                    return;
                }
            },
            removeAllItems: function() {
                var prefixLength = this.prefix.length;

                for (var key in localStorage) {
                    if (key.substr(0, prefixLength) === this.prefix)
                        localStorage.removeItem(key);
                };
            }
        }
    });
    
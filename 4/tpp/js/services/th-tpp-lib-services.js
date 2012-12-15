/*
    services:
        lib - returns a library of generic functions
*/

angular.module('tpp').
    service('libService', function() {
        var lib = {};

        lib.createNestedObject = function(base, names, value) {
            //creates a nested object - see http://stackoverflow.com/questions/5484673
            //e.g. lib.createNestedObject({}, ['a', 'b'], 1)) -> { a: { b: 1 } }
            //e.g. lib.createNestedObject({ a: { b: 1 } }, ['a', 'c', 'd'], 2)) -> { a: { b: 1, c: { d: 2 } } }
            var x = base, lastName = (arguments.length === 3 ? names.pop() : false);
            for (var i in names) { x = x[names[i]] = (x[names[i]] || {}) };
            if (lastName) { x[lastName] = value };
            return base;
        };

        lib.deleteObjectFunctions = function(obj) {
            for (var key in obj) {
                if (typeof obj[key] == 'function') {
                    delete obj[key];
                }
            };
        };

        lib.any = function(arr, func) {
          for (var i=0; i<arr.length; i++) {
            if (func(arr[i])) return true;
          };
          return false;
        };

        lib.all = function(arr, func) {
          for (var i=0; i<arr.length; i++) {
            if (!func(arr[i])) return false;
          };
          return true;
        };
        
        lib.isProbablyValidEmail = function(s) { //'probably' because 'definitely' is apparently not really possible
          //see also: http://www.regular-expressions.info/email.html and http://en.wikipedia.org/wiki/Email_address          
          var reg = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
          return reg.test(s);
        };

        return lib;
    });
    
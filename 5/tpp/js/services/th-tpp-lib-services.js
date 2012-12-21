/*
    services:
        lib - returns a library of generic functions
*/

angular.module('tpp').
    service('libService', function($window) {
        var lib = {};

        //object functions
        lib.obj = {};
        
        lib.obj.createNestedObject = function(base, names, value) {
          //creates a nested object - see http://stackoverflow.com/questions/5484673
          //e.g. lib.createNestedObject({}, ['a', 'b'], 1)) -> { a: { b: 1 } }
          //e.g. lib.createNestedObject({ a: { b: 1 } }, ['a', 'c', 'd'], 2)) -> { a: { b: 1, c: { d: 2 } } }
          var x = base, lastName = (arguments.length === 3 ? names.pop() : false);
          for (var i in names) { x = x[names[i]] = (x[names[i]] || {}) };
          if (lastName) { x[lastName] = value };
          return base;
        };

        lib.obj.deleteObjectFunctions = function(obj) {
          //deletes all direct function properties from an object
          for (var key in obj) {
            if (typeof obj[key] == 'function') {
              delete obj[key];
            }
          };
        };

        //array functions
        lib.arr = {};
        
        lib.arr.any = function(arr, func) {
          //returns true if any func(arr.item) returns true, o/w false
          for (var i=0; i<arr.length; i++) {
            if (func(arr[i])) return true;
          };
          return false;
        };

        lib.arr.all = function(arr, func) {
          //returns true if all func(arr.item) return true, o/w false
          for (var i=0; i<arr.length; i++) {
            if (!func(arr[i])) return false;
          };
          return true;
        };
        
        lib.arr.removeValue = function(arr, val){
          for (var i=0; i<arr.length; i++) {
            if (arr[i]===val) { arr.splice(i,1); }
          };
        };

        lib.arr.haveCommonValue = function(arr1, arr2) {
          return lib.arr.any(arr1, function(arr1item) {
            return lib.arr.any(arr2, function(arr2item) { return (arr1item === arr2item); });
          });
        };
        
        //window functions
        lib.window = {};
        
        lib.window.scroll = function(options) {
          //animates the scrolling of the browser window
          options = options || {};
          options.increment = options.increment || 5; //number of pixels to move
          options.interval = options.interval || 10; //loop speed in ms
          options.top = options.top || 100; //minumum window position which triggers stop
          
          var intervalId = setInterval(function() {
              $window.scrollBy(0, options.increment);
              if ($window.pageYOffset >= options.top) { clearInterval(intervalId); }
          }, options.interval);
        };
        
        lib.window.getWidth = function() {
          //returns the width of the browser window
          return $window.innerWidth || $window.document.body.clientWidth;
        }

        //misc
        lib.misc = {};
        
        lib.misc.isProbablyValidEmail = function(s) {
          //returns true if s is probably a valid email
          //'probably' because 'definitely' is apparently not really possible
          //see also: http://www.regular-expressions.info/email.html and http://en.wikipedia.org/wiki/Email_address          
          var reg = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
          return reg.test(s);
        };
        
        return lib;
    });
    
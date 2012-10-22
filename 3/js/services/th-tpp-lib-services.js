/*
    services:
        lib - returns a library of generic functions
*/

angular.module('tpp').
    service('lib', function() {
        return {
            // Function: createNestedObject( base, names[, value] )
            //      taken from http://stackoverflow.com/questions/5484673
            //      base: the object on which to create the hierarchy
            //      names: an array of strings contaning the names of the objects
            //      value (optional): if given, will be the last object in the hierarchy
            createNestedObject: function( base, names, value ) { 
                // If a value is given, remove the last name and keep it for later:
                var lastName = arguments.length === 3 ? names.pop() : false;

                // Walk the hierarchy, creating new objects where needed.
                // If the lastName was removed, then the last object is not set yet:
                for( var i in names ) base = base[ names[i] ] = base[ names[i] ] || { };

                // If a value was given, set it with the last name:
                if( lastName ) base = base[ lastName ] = value;

                // Return the last object in the hierarchy:
                return base;
            }
        }
    });
    
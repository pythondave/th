/* *** Services WIP - lots to learn and incorporate!

    + learn about using with local storage - and implement
    * learn about using with external storage (e.g. json/jsonp) - and implement
*/
/*
    user page:
        getNext - returns the next page
        getIsSufficient - returns true if the user page is sufficiently filled out
        
    user section:
        getNext - returns the next section
        getIsSufficient - returns true if all pages are sufficiently filled out
        
*/

/*
    services:
        sectionsService - returns the section / page structure
        roleService - returns a list of roles
        subjectService - returns a list of subjects
        lib - returns a library of generic functions
        localStorageService - service for saving stuff locally
        userService - service for getting and setting the user model
*/

angular.module('tpp').
    service('sectionsService', function() {
        /*
            Note: this currently relies on all ids being directly linked to their array position (id = array position + 1) - *** consider refactoring to avoid this link
        */
        
        var sectionsService = {};
        
        var Section = function(options) { //section constructor
            this.id = options.id;
            this.name = options.name;
            this.pages = options.pages;
            for (var i=0; i<this.pages.length; i++) {
                this.pages[i].sectionId = this.id;
            };
        };
        var Page = function(options) { //page constructor
            this.id = options.id;
            this.name = options.name;
        };
        sectionsService.Section = Section;
        sectionsService.Page = Page;
        
        sectionsService.sections = [
            new Section({ id: 1, name: 'Essentials',
                pages: [
                    new Page({ id: 1, name: 'What are you looking for?' }),
                    new Page({ id: 2, name: 'Contact Information' }),
                    new Page({ id: 3, name: 'Key Details' }),
                    new Page({ id: 4, name: 'CV & Photo' })
                ]
            }),
            new Section({ id: 2, name: 'Important Information',
                pages: [
                    new Page({ id: 1, name: 'Ref 1' }),
                    new Page({ id: 2, name: 'Ref 2' }),
                    new Page({ id: 3, name: 'Ref 3' }),
                    new Page({ id: 4, name: 'My job search' }),
                    new Page({ id: 5, name: 'Joint applications' }),
                    new Page({ id: 6, name: 'Joint applications' }),
                    new Page({ id: 7, name: 'Professional experience' })
                ]
            }),
            new Section({ id: 3, name: 'Really Shine!',
                pages: [
                    new Page({ id: 1, name: 'Skills and languages' }),
                    new Page({ id: 2, name: 'Supporting docs and videos' })
                ]
            })
        ];
        
        sectionsService.getSection = function(sectionId) {
            return this.sections[sectionId-1];
        };

        sectionsService.getPage = function(sectionId, pageId) {
            return this.getSection(sectionId).pages[pageId-1];
        };
        
        sectionsService.pageExists = function(sectionId, pageId) {
            return !!this.getPage(sectionId, pageId);
        };
        
        return sectionsService;
    }).
    service('roleService', function() {
        return {
            roles: [{ id: 21, name: "Classroom teacher" },
                    { id: 22, name: "Early Years / Kindergarten Teacher" },
                    { id: 23, name: "Head of Department" },
                    { id: 24, name: "Primary / Elementary Teacher" },
                    { id: 25, name: "Head of School" },
                    { id: 26, name: "Counsellor" },
                    { id: 27, name: "Curriculum Coordinator" },
                    { id: 28, name: "Deputy Head / Vice Principal" },
                    { id: 29, name: "Director of Studies" },
                    { id: 30, name: "Educational Psychologist" },
                    { id: 31, name: "English as a Foreign Language Teacher" },
                    { id: 32, name: "Head of Primary/Elementary" },
                    { id: 33, name: "Head of Secondary" },
                    { id: 34, name: "Head of Section" },
                    { id: 35, name: "Head of Year (pastoral)" },
                    { id: 36, name: "IB PYP Coordinator" },
                    { id: 37, name: "IB MYP Coordinator" },
                    { id: 38, name: "IB DP Coordinator" },
                    { id: 39, name: "Librarian" },
                    { id: 40, name: "Head of Year (pastoral)" },
                    { id: 41, name: "Other Position" },
                    { id: 42, name: "Special Needs Teacher" },
                    { id: 43, name: "Subject Leader" },
                    { id: 44, name: "Teaching Assistant" }
            ]
        }
    }).
    service('subjectService', function() {
        return {
            subjects: [ { id: 21, name: 'Subject A' },
                        { id: 22, name: 'Subject B' },
                        { id: 23, name: 'Subject D' },
                        { id: 24, name: 'Subject E' },
                        { id: 25, name: 'Subject F' }
            ]
        }
    }).
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
    }).
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
    }).
    service('userService', function (localStorageService, sectionsService) {
        var userService = {};
        
        /*
            there are 2 versions of the user object:
            
                1. Full - for use of the general application
                2. Stripped - for saving (like full but with all non-changing values removed - e.g. functions)
                
            When saving, full is converted to stripped.
            When retrieving, stripped is converted to full.
        */

        var _user = localStorageService.getItem('user'); //get stripped from local storage (if present)
        var isStored = !!_user;

        //initial user object
        var initialUserValue = {
            roles: { val: [] },
            subjects: { val: [] },
            subscribe: { val: true },
            furthestLocation: { sectionId: 1, pageId: 1 },
            currentLocation: { sectionId: 1, pageId: 1 }
        };
        
        if (!isStored) { //if not stored, initialise stripped
            _user = initialUserValue;
        };
        
        var addDecorators = function(user) { //adds decorator functions to a user object
            var addDecoratorsFromSectionsService = function() { angular.extend(user, sectionsService); };
            
            var addCurrentLocationDecorators = function() { //adds getPath, getPage and moveNext to currentLocation
                user.currentLocation.getPath = function() {
                    return '/' + user.currentLocation.sectionId + '/' + user.currentLocation.pageId
                };
                user.currentLocation.getPage = function() {
                    return user.getPage(user.currentLocation.sectionId, user.currentLocation.pageId);
                };
                user.currentLocation.moveNext = function() {
                    if (sectionsService.pageExists(user.currentLocation.sectionId, user.currentLocation.pageId+1)) {
                        user.currentLocation.pageId++;
                    } else {
                        user.currentLocation.sectionId++;
                        user.currentLocation.pageId = 1;
                    };
                    return this;
                };
            };
            
            var addSectionDecorators = function() { //adds getIsVisited, getIsCurrent and getIsSufficient to all sections
                sectionsService.Section.prototype.getIsVisited = function() {
                    return (this.sectionId <= user.furthestLocation.sectionId);
                };
                sectionsService.Section.prototype.getIsCurrent = function() {
                    return (this.sectionId === user.currentLocation.sectionId);
                };
                sectionsService.Section.prototype.getIsSufficient = function() {
                    return true;
                };
            };

            var addPageDecorators = function() { //adds getIsVisited, getIsCurrent and getIsSufficient to all pages
                sectionsService.Page.prototype.getIsVisited = function() {
                    return (this.sectionId * 100 + this.id <= user.furthestLocation.sectionId * 100 + user.furthestLocation.pageId);
                };
                sectionsService.Page.prototype.getIsCurrent = function() {
                    return (this.sectionId * 100 + this.id === user.currentLocation.sectionId * 100 + user.currentLocation.pageId);
                };
                //add getIsSufficient functions to all PAGES - these return true if the page is sufficiently filled out, o/w false
                user.getPage(1, 1).getIsSufficient = function() {
                    return (user.roles.getIsSufficient() && user.subjects.getIsSufficient()); // && !!user.subscribe;
                };
                user.getPage(1, 2).getIsSufficient = function() {
                    return true;
                };
                user.getPage(1, 3).getIsSufficient = function() {
                    return true;
                };
                user.getPage(1, 4).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 1).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 2).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 3).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 4).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 5).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 6).getIsSufficient = function() {
                    return true;
                };
                user.getPage(2, 7).getIsSufficient = function() {
                    return true;
                };
                user.getPage(3, 1).getIsSufficient = function() {
                    return true;
                };
                user.getPage(3, 2).getIsSufficient = function() {
                    return true;
                };
                //
            };

            var addFieldDecorators = function() {
                user.roles.getIsSufficient = function() { return user.roles.val.length > 0 }
                user.roles.getClass = function() {
                    return user.roles.getIsSufficient() ? 'isSufficient' : '';
                };
                user.subjects.getIsSufficient = function() { return user.subjects.val.length > 0 }
                user.subscribe.getIsSufficient = function() { return user.subscribe.val }
                user.subscribe.getClass = function() { return user.subscribe.getIsSufficient() ? 'isSufficient' : ''; }
            };
            
            addDecoratorsFromSectionsService();
            addCurrentLocationDecorators();
            addPageDecorators();
            addFieldDecorators();
        };
        addDecorators(_user);
        userService.user = _user;

        userService.save = function() { //*** TODO: improve so only saves what's necessary (i.e. not the section data)
            localStorageService.setItem('user', _user);
        };
        if (!isStored) { //if not stored, save for first time
            userService.save();
        };

        userService.setLocation = function(sectionId, pageId) {
            sectionId = Number(sectionId);
            pageId = Number(pageId);
            _usercurrentLocation = sectionId;
            _user.currentLocation.pageId = pageId;
            if (sectionId * 100 + pageId > _user.furthestLocation.sectionId * 100 + _user.furthestLocation.pageId) {
                _user.furthestLocation.sectionId = sectionId;
                _user.furthestLocation.pageId = pageId;
            };
            this.save();
        };
        
        userService.reset = function() {
            //copy the initial user values to the user object
            for (var key1 in initialUserValue) { //*** TODO: create and make use of a more generic function based on this
                if (initialUserValue.hasOwnProperty(key1)) {
                    var obj = initialUserValue[key1];
                    for (var key2 in obj) {
                        if (obj.hasOwnProperty(key2)) {
                            _user[key1][key2] = obj[key2];
                        };
                    };
                };
            };
            this.save();
        };
        
        return userService;
    });
    
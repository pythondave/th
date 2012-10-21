/*
    services:
        userService - service for the user model
*/

angular.module('tpp').
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
            roles: { val: [], elemId: 'role' },
            subjects: { val: [], elemId: 'subject' },
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
                    return (this.id <= user.furthestLocation.sectionId);
                };
                sectionsService.Section.prototype.getIsCurrent = function() {
                    return (this.id === user.currentLocation.sectionId);
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
                    return false;
                };
                user.getPage(1, 3).getIsSufficient = function() {
                    return false;
                };
                user.getPage(1, 4).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 1).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 2).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 3).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 4).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 5).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 6).getIsSufficient = function() {
                    return false;
                };
                user.getPage(2, 7).getIsSufficient = function() {
                    return false;
                };
                user.getPage(3, 1).getIsSufficient = function() {
                    return false;
                };
                user.getPage(3, 2).getIsSufficient = function() {
                    return false;
                };
                //
            };

            var addFieldDecorators = function() {
                user.roles.getIsSufficient = function() { return user.roles.val.length > 0; };
                user.roles.getClass = function() { return user.roles.getIsSufficient() ? 'isSufficient' : ''; };
                user.subjects.getIsSufficient = function() {
                    return user.subjects.val.length > 0;
                };
                user.subjects.getClass = function() { return user.subjects.getIsSufficient() ? 'isSufficient' : ''; };
                user.subscribe.getIsSufficient = function() { return true; }
                user.subscribe.getClass = function() { return ''; };
            };

            addDecoratorsFromSectionsService();
            addCurrentLocationDecorators();
            addSectionDecorators();
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
    
/*
  services:
    userService - service for the user model
*/

angular.module('tpp').
  service('userService', function (localStorageService, sectionsService, libService) {
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
      furthestLocation: { sectionId: 1, pageId: 1 },
      currentLocation: { sectionId: 1, pageId: 1 },
      roles: { val: [], elemId: 'role' },
      subjects: { val: [], elemId: 'subject' },
      subscribe: { val: true },
      countryCode: { val: '' },
      phoneNumber: { val: '' },
      skype: {},
      educationLevels: { val: [] },
      hasCurrentJob: { val: true },
      cv: { files: {} },
      photo: { files: {} },
      referees: [
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } },
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } },
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } }
      ],
      computerSkills: { val: [] },
      teachingSkills: { val: [] },
      languages: { val: [] }
    };
    
    isStored = false; //set this to override reset
    if (!isStored) { //if not stored, initialise stripped
      _user = initialUserValue;
    };
    
    var addDecorators = function(user) { //adds decorator functions to a user object
      var addDecoratorsFromSectionsService = function() { angular.extend(user, sectionsService); };
      
      var addCurrentLocationDecorators = function() { //adds getPath, getPage and getNext to currentLocation
        user.currentLocation.getPath = function() {
          return '/' + user.currentLocation.sectionId + '/' + user.currentLocation.pageId
        };
        user.currentLocation.getPage = function() {
          return user.getPage(user.currentLocation.sectionId, user.currentLocation.pageId);
        };
        user.currentLocation.getNext = function() {
          return sectionsService.getNextPage(user.currentLocation.sectionId, user.currentLocation.pageId);
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
          return (user.roles.getIsSufficient() && user.subjects.getIsSufficient());
        };
        user.getPage(1, 2).getIsSufficient = function() {
          var x = user.countryCode.getIsSufficient() && user.phoneNumber.getIsSufficient();
          return x;
        };
        user.getPage(1, 3).getIsSufficient = function() {
          return false;
        };
        user.getPage(1, 4).getIsSufficient = function() {
          var x = (user.cv.files.length > 0) && (user.photo.files.length > 0);
          return x;
        };
        user.getPage(2, 1).getIsSufficient = function() {
          var x = user.referees[0].name.getIsSufficient() && user.referees[0].email.getIsSufficient() &&
                  user.referees[0].institution.getIsSufficient() && user.referees[0].phoneNumber.getIsSufficient();
          return x;
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
        //*** TODO: consider putting the values here into a data structure
        //getTip
        user.roles.getTip = function() { return 'Roles Tip' };
        user.subjects.getTip = function() { return 'Subjects Tip' };
        user.countryCode.getTip = function() { return 'Country Code Tip' };
        user.phoneNumber.getTip = function() { return 'Phone Number Tip' };
        user.skype.getTip = function() { return 'Skype Tip' };
        user.referees[0].name.getTip = function() { return 'Referee Name Tip' };
        user.referees[0].email.getTip = function() { return 'Make sure this is correct, when entered it will send an automatic reference request questionnaire for the referee to complete.' };
        user.referees[0].institution.getTip = function() { return 'Referee Institution Tip' };
        user.referees[0].phoneNumber.getTip = function() { return 'Referee Phone Number Tip' };
        user.referees[1].name.getTip = function() { return 'Referee Name Tip' };
        user.referees[1].email.getTip = function() { return 'Make sure this is correct, when entered it will send an automatic reference request questionnaire for the referee to complete.' };
        user.referees[1].institution.getTip = function() { return 'Referee Institution Tip' };
        user.referees[1].phoneNumber.getTip = function() { return 'Referee Phone Number Tip' };
        user.referees[2].name.getTip = function() { return 'Referee Name Tip' };
        user.referees[2].email.getTip = function() { return 'Make sure this is correct, when entered it will send an automatic reference request questionnaire for the referee to complete.' };
        user.referees[2].institution.getTip = function() { return 'Referee Institution Tip' };
        user.referees[2].phoneNumber.getTip = function() { return 'Referee Phone Number Tip' };
        user.cv.getTip = function() { return 'Add your CV so that you can start applying for jobs. It is advisable to add a CV as a PDF document.' };
        user.photo.getTip = function() { return 'International schools place a large importance on your photo as they often can\'t see you face-to-face. Make sure it is a professional looking photo (passport style) and that your face shows clearly.' };
        //
        
        //getIsSufficient
        user.roles.getIsSufficient = function() { return user.roles.val.length > 0; };
        user.subjects.getIsSufficient = function() { return user.subjects.val.length > 0; };
        user.subscribe.getIsSufficient = function() { return true; }
        user.countryCode.getIsSufficient = function() { return user.countryCode.val.length > 0; };
        user.phoneNumber.getIsSufficient = function() { return user.phoneNumber.val.length > 10; };
        user.referees[0].name.getIsSufficient = function() { return user.referees[0].name.val.length > 10; };
        user.referees[0].email.getIsSufficient = function() { return user.referees[0].email.val.length > 10; };
        user.referees[0].institution.getIsSufficient = function() { return user.referees[0].institution.val.length > 10; };
        user.referees[0].phoneNumber.getIsSufficient = function() { return user.referees[0].phoneNumber.val.length > 10; };
        //

        //getClass
        user.roles.getClass = function() { return user.roles.getIsSufficient() ? 'isSufficient' : ''; };
        user.subjects.getClass = function() { return user.subjects.getIsSufficient() ? 'isSufficient' : ''; };
        user.subscribe.getClass = function() { return ''; };
        user.phoneNumber.getClass = function() { return user.phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        user.hasCurrentJob.getClass = function() { return ''; };
        user.referees[0].name.getClass = function() { return user.referees[0].name.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].email.getClass = function() { return user.referees[0].email.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].institution.getClass = function() { return user.referees[0].institution.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].phoneNumber.getClass = function() { return user.referees[0].phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        //
      };

      var addMiscDecorators = function() {
        user.getPercentageComplete = function() {
          
        };
      };
      
      addDecoratorsFromSectionsService();
      addCurrentLocationDecorators();
      addSectionDecorators();
      addPageDecorators();
      addFieldDecorators();
      addMiscDecorators();
    };
    addDecorators(_user);
    userService.user = _user;

    userService.save = function() {
      var stripped = angular.copy(_user);
      delete stripped.sections;
      localStorageService.setItem('user', stripped);
    };
    if (!isStored) { //if not stored, save for first time
      userService.save();
    };

    userService.setLocation = function(sectionId, pageId, allowBeyondFurthestLocation) {
      sectionId = Number(sectionId);
      pageId = Number(pageId);
      var isBeyondFurthestLocation = (sectionId * 100 + pageId > _user.furthestLocation.sectionId * 100 + _user.furthestLocation.pageId);
      if (isBeyondFurthestLocation && !allowBeyondFurthestLocation) { return false; }; //change not made (change to this location not allowed)
      _user.currentLocation.sectionId = sectionId;
      _user.currentLocation.pageId = pageId;
      if (isBeyondFurthestLocation) { //a new furthest location
        _user.furthestLocation.sectionId = sectionId;
        _user.furthestLocation.pageId = pageId;
      };
      this.save();
      return true; //change made
    };
    
    userService.resetUser = function() { //resets the user object to the initial state
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
    
    userService.deleteUser = function() { //deletes all the user details from the database
      localStorageService.removeAllItems()
    };
    
    return userService;
  });
  
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
      //1.1
      roles: { val: [] },
      subjects: { val: [] },
      subscribe: { val: true },
      //1.2
      countryCode: { val: '' },
      phoneNumber: { val: '' },
      skype: { val: '' },
      //1.3
      nationality: { val: '' },
      teachingQualificationCountry: { val: '' },
      educationLevels: { val: [] },
      hasCurrentJob: { val: true },
      //1.4
      cv: { files: {} },
      photo: { files: {} },
      //2.1
      referees: [
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' }, 
          position: { val: '' }
        },
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } },
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } }
      ],
      //2.2
      //2.3
      //2.4
      locationsConsidered: { val: [] },
      curriculaOfInterest: { val: [] },
      ageLevels: { val: [] },
      numberOfDependentChildren: { val: [] },
      birthYear: { val: '' },
      maritalStatus: { val: [] },
      isJointApplication: { val: [] },
      partnersMemberNumber: { val: '' },
      //2.5
      reducedChildFees: { val: [] },
      saveMoneyAbility: { val: [] },
      accommodationProvided: { val: [] },
      healthInsuranceProvided: { val: [] },
      ppdProvided: { val: [] },
      //2.6
      curriculumExperience: { val: [] },
      //3.1
      computerSkills: { val: [] },
      teachingSkills: { val: [] },
      languages: { val: [] }
      //3.2
    };
    
    //isStored = false; //set this to override reset
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
        sectionsService.Page.prototype.getCompletionLevel = function() { //override this at the page level if this generic function doesn't fit
          if (libService.all(this.fields, function(field) { return field.getIsSufficient(); } )) return 2; //if all fields are sufficient
          if (libService.any(this.fields, function(field) { return field.getIsSufficient(); } )) return 1; //if any field is sufficient
          return 0; //no fields are sufficient
        };
        sectionsService.Page.prototype.getPercentageComplete = function() {
          //console.log('getPercentageComplete', this.sectionId, this.id, this.getCompletionLevel())
          return (this.getCompletionLevel() > 0 ? 5 : 0);
        };
        user.getPage(0, 1).fields = [];
        user.getPage(0, 2).fields = [];
        user.getPage(1, 1).fields = [user.roles, user.subjects];
        user.getPage(1, 2).fields = [user.countryCode, user.phoneNumber, user.skype];
        user.getPage(1, 3).fields = [user.nationality, user.teachingQualificationCountry, user.educationLevels];
        user.getPage(1, 4).fields = [user.cv, user.photo];
        user.getPage(2, 1).fields = [user.referees[0].name, user.referees[0].email, user.referees[0].institution, user.referees[0].phoneNumber];
        user.getPage(2, 2).fields = [user.referees[1].name, user.referees[1].email, user.referees[1].institution, user.referees[1].phoneNumber];
        user.getPage(2, 3).fields = [user.referees[2].name, user.referees[2].email, user.referees[2].institution, user.referees[2].phoneNumber];
        user.getPage(2, 4).fields = [user.locationsConsidered, user.curriculaOfInterest, user.ageLevels,
                                     user.numberOfDependentChildren, user.birthYear, user.maritalStatus,
                                     user.isJointApplication, user.partnersMemberNumber];
        user.getPage(2, 5).fields = [user.reducedChildFees, user.saveMoneyAbility, user.accommodationProvided, user.healthInsuranceProvided, user.ppdProvided];
        user.getPage(2, 6).fields = [];
        user.getPage(3, 1).fields = [user.computerSkills, user.teachingSkills, user.languages];
        user.getPage(3, 2).fields = [];
        //
      };
      

      
      var addFieldDecorators = function() {
        //*** TODO: consider putting the values here into a data structure
        //getTip
        //1.1
        user.roles.getTip = function() { return 'Your Teacherhorizons profile will help you: Search jobs, showcase your skills and experience and be found for new opportunities' };
        user.subjects.getTip = function() { return 'Tell us which positions you\'re interested in (add up to three and be realistic!)' };
        user.countryCode.getTip = function() { return 'Country Code Tip' };
        //1.2
        user.phoneNumber.getTip = function() { return 'Phone Number Tip' };
        user.skype.getTip = function() { return 'Most Heads are likely to want to carry out a Skype interview with you.  Test the video and sound beforehand.  If you don\'t have an account it won\'t take more than 10 mins to create one: http://www.skype.com' };
        //1.4
        user.cv.getTip = function() { return 'Add your CV so that you can start applying for jobs. It is advisable to add a CV as a PDF document.' };
        user.photo.getTip = function() { return 'International schools place a large importance on your photo as they often can\'t see you face-to-face. Make sure it is a professional looking photo (passport style) and that your face shows clearly.' };
        //2.1
        user.referees[0].name.getTip = function() { return 'Referee Name Tip' };
        user.referees[0].email.getTip = function() { return 'Make sure this is correct, when entered it will send an automatic reference request questionnaire for the referee to complete.' };
        user.referees[0].institution.getTip = function() { return 'Referee Institution Tip' };
        user.referees[0].phoneNumber.getTip = function() { return 'Referee Phone Number Tip' };
        //2.2
        user.referees[1].name.getTip = function() { return 'Referee Name Tip' };
        user.referees[1].email.getTip = function() { return 'Make sure this is correct, when entered it will send an automatic reference request questionnaire for the referee to complete.' };
        user.referees[1].institution.getTip = function() { return 'Referee Institution Tip' };
        user.referees[1].phoneNumber.getTip = function() { return 'Referee Phone Number Tip' };
        //2.3
        user.referees[2].name.getTip = function() { return 'Referee Name Tip' };
        user.referees[2].email.getTip = function() { return 'Make sure this is correct, when entered it will send an automatic reference request questionnaire for the referee to complete.' };
        user.referees[2].institution.getTip = function() { return 'Referee Institution Tip' };
        user.referees[2].phoneNumber.getTip = function() { return 'Referee Phone Number Tip' };
        //2.4
        //2.5
        //2.6
        user.curriculumExperience.getTip = function() { return 'Enter up to 5 different curricula you have taught in the past 10 years' };
        //3.1
        //3.2
        
        //getIsSufficient
        //1.1
        user.roles.getIsSufficient = function() { return user.roles.val.length > 0; };
        user.subjects.getIsSufficient = function() { return user.subjects.val.length > 0; };
        user.subscribe.getIsSufficient = function() { return true; }
        //1.2
        user.countryCode.getIsSufficient = function() { return user.countryCode.val.length > 0; };
        user.phoneNumber.getIsSufficient = function() { return user.phoneNumber.val.length > 0; };
        user.skype.getIsSufficient = function() { return user.skype.val.length > 0; };
        //1.3
        user.nationality.getIsSufficient = function() { return user.nationality.val.length > 0; };
        user.teachingQualificationCountry.getIsSufficient = function() { return user.teachingQualificationCountry.val.length > 0; };
        user.educationLevels.getIsSufficient = function() { return user.educationLevels.val.length > 0; };
        //1.4
        user.cv.getIsSufficient = function() { return user.cv.files.length > 0; };
        user.photo.getIsSufficient = function() { return user.photo.files.length > 0; };
        //2.1
        user.referees[0].name.getIsSufficient = function() { return user.referees[0].name.val.length > 0; };
        user.referees[0].email.getIsSufficient = function() { return user.referees[0].email.val.length > 0; };
        user.referees[0].institution.getIsSufficient = function() { return user.referees[0].institution.val.length > 0; };
        user.referees[0].phoneNumber.getIsSufficient = function() { return user.referees[0].phoneNumber.val.length > 0; };
        user.referees[0].position.getIsSufficient = function() { return user.referees[0].position.val.length > 0; };
        //2.2
        user.referees[1].name.getIsSufficient = function() { return user.referees[1].name.val.length > 0; };
        user.referees[1].email.getIsSufficient = function() { return user.referees[1].email.val.length > 0; };
        user.referees[1].institution.getIsSufficient = function() { return user.referees[1].institution.val.length > 0; };
        user.referees[1].phoneNumber.getIsSufficient = function() { return user.referees[1].phoneNumber.val.length > 0; };
        //2.3
        user.referees[2].name.getIsSufficient = function() { return user.referees[2].name.val.length > 0; };
        user.referees[2].email.getIsSufficient = function() { return user.referees[2].email.val.length > 0; };
        user.referees[2].institution.getIsSufficient = function() { return user.referees[2].institution.val.length > 0; };
        user.referees[2].phoneNumber.getIsSufficient = function() { return user.referees[2].phoneNumber.val.length > 0; };
        //2.4
        user.locationsConsidered.getIsSufficient = function() { return user.locationsConsidered.val.length > 0; };
        user.curriculaOfInterest.getIsSufficient = function() { return user.curriculaOfInterest.val.length > 0; };
        user.ageLevels.getIsSufficient = function() { return user.ageLevels.val.length > 0; };
        user.numberOfDependentChildren.getIsSufficient = function() { return user.numberOfDependentChildren.val.length > 0; };
        user.birthYear.getIsSufficient = function() { return user.birthYear.val.length > 0; };
        user.maritalStatus.getIsSufficient = function() { return user.maritalStatus.val.length > 0; };
        user.isJointApplication.getIsSufficient = function() { return user.isJointApplication.val.length > 0; };
        user.partnersMemberNumber.getIsSufficient = function() { return user.partnersMemberNumber.val.length > 0; };                                     
        //2.5
        user.reducedChildFees.getIsSufficient = function() { return user.reducedChildFees.val.length > 0; };
        user.saveMoneyAbility.getIsSufficient = function() { return user.saveMoneyAbility.val.length > 0; };
        user.accommodationProvided.getIsSufficient = function() { return user.accommodationProvided.val.length > 0; };
        user.healthInsuranceProvided.getIsSufficient = function() { return user.healthInsuranceProvided.val.length > 0; };
        user.ppdProvided.getIsSufficient = function() { return user.ppdProvided.val.length > 0; };
        //2.6
        //3.1
        user.computerSkills.getIsSufficient = function() { return user.computerSkills.val.length > 0; };
        user.teachingSkills.getIsSufficient = function() { return user.teachingSkills.val.length > 0; };
        user.languages.getIsSufficient = function() { return user.languages.val.length > 0; };
        //3.2
      
        //getClass
        //1.1
        user.roles.getClass = function() { return user.roles.getIsSufficient() ? 'isSufficient' : ''; };
        user.subjects.getClass = function() { return user.subjects.getIsSufficient() ? 'isSufficient' : ''; };
        user.subscribe.getClass = function() { return ''; };
        //1.2
        user.phoneNumber.getClass = function() { return user.phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        user.skype.getClass = function() { return user.skype.getIsSufficient() ? 'isSufficient' : ''; };
        //1.3
        user.hasCurrentJob.getClass = function() { return ''; };
        //2.1
        user.referees[0].name.getClass = function() { return user.referees[0].name.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].email.getClass = function() { return user.referees[0].email.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].institution.getClass = function() { return user.referees[0].institution.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].phoneNumber.getClass = function() { return user.referees[0].phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        //
      };

      var addMiscDecorators = function() {
        user.getPercentageComplete = function() {
          var x = 30;
          for (var i=0; i<user.sections.length; i++) {
            var section = user.sections[i];
            for (var j=0; j<section.pages.length; j++) {
              var page = section.pages[j];
              x += page.getPercentageComplete();
            };
          };
          return x;
        };
        user.getPercentageCompleteStyle = function() {
          return { width: 17.5*user.getPercentageComplete()/10 + 'px' };
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

    userService.isBeyondFurthestLocation = function(sectionId, pageId) {
      sectionId = Number(sectionId);
      pageId = Number(pageId);
      return (sectionId * 100 + pageId > _user.furthestLocation.sectionId * 100 + _user.furthestLocation.pageId);
    };
    
    userService.setLocation = function(sectionId, pageId, allowBeyondFurthestLocation) {
      sectionId = Number(sectionId);
      pageId = Number(pageId);
      var isBeyondFurthestLocation = userService.isBeyondFurthestLocation(sectionId, pageId);
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
  
/*
  services:
    userService - service for the user model
*/

angular.module('tpp').
  service('userService', function (localStorageService, sectionsService, libService) {
    var userService = {};
    
    /*
      There are 2 versions of the user object:
      
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
      visibleSectionId : 1,
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
      availability: { val: '' },
      hasCurrentJob: { val: true },
      availableFrom: {},
      //1.4
      cv: { val: [] },
      photo: { val: [] },
      //2.1-2.3
      referees: [
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, position: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } },
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, position: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } },
        { type: { val: '' }, name: { val: '' }, email: { val: '' }, institution: { val: '' }, position: { val: '' }, countryCode: { val: '' }, phoneNumber: { val: '' } }
      ],
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
      numberOfYearsTeachingExperience: { val: undefined },
      internationalSchoolExperience: { val: [] },
      curriculumExperience: { val: [] },
      currentEmployer: { val: '' },
      currentCountry: { val: '' },
      currentRoles: { val: [] },
      currentSubjects: { val: [] },
      currentStartDate: { val: '' },
      currentEndDate: { val: '' },
      //3.1
      computerSkills: { val: [] },
      teachingSkills: { val: [] },
      languages: { val: [] },
      //3.2
      teachingCertificates: { val: [] },
      degreeCertificates: { val: [] },
      policeClearanceCertificate: { val: [] },
      performanceReviewOrRecommendation: { val: [] },
      teachingPhilosophyStatement: { val: [] },
      videos: { val: [] }
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
        user.currentLocation.isPage = function(sectionId, pageId) {
          return (sectionId === user.currentLocation.sectionId && pageId === user.currentLocation.pageId);
        };
      };
      
      var addSectionDecorators = function() { //adds getIsVisited, getIsCurrent and getIsSufficient to all sections
        sectionsService.Section.prototype.getIsVisited = function() {
          return (this.id <= user.furthestLocation.sectionId);
        };
        sectionsService.Section.prototype.getIsCurrent = function() {
          return (this.id === user.currentLocation.sectionId);
        };
        sectionsService.Section.prototype.getIsVisible = function() {
          return (this.id === user.visibleSectionId);
        };
        sectionsService.Section.prototype.getIsSufficient = function() {
          return true;
        };
        sectionsService.Section.prototype.getNumberOfVisiblePages = function() {
          return (this.id < user.furthestLocation.sectionId ? this.pages.length : user.furthestLocation.pageId);
        }
        sectionsService.Section.prototype.getHeightInPixels = function() {
          return (this.getIsVisible() ? this.getNumberOfVisiblePages() * 23.75 - 9 : 0);
        }
      };

      var addPageDecorators = function() { //adds getIsVisited, getIsCurrent and getIsSufficient to all pages
        sectionsService.Page.prototype.getIsVisited = function() {
          return (this.sectionId * 100 + this.id <= user.furthestLocation.sectionId * 100 + user.furthestLocation.pageId);
        };
        sectionsService.Page.prototype.getIsCurrent = function() {
          return (this.sectionId * 100 + this.id === user.currentLocation.sectionId * 100 + user.currentLocation.pageId);
        };
        //required fields
        user.getPage(0, 1).fields = [];
        user.getPage(0, 2).fields = [];
        user.getPage(1, 1).fields = [user.roles, user.subjects];
        user.getPage(1, 2).fields = [user.countryCode, user.phoneNumber, user.skype];
        user.getPage(1, 3).fields = [user.nationality, user.teachingQualificationCountry, user.educationLevels];
        user.getPage(1, 4).fields = [user.cv];
        user.getPage(2, 1).fields = [user.referees[0].type, user.referees[0].name, user.referees[0].email, user.referees[0].institution, user.referees[0].position];
        user.getPage(2, 2).fields = [user.referees[1].type, user.referees[1].name, user.referees[1].email, user.referees[1].institution, user.referees[1].position];
        user.getPage(2, 3).fields = [user.referees[2].type, user.referees[2].name, user.referees[2].email, user.referees[2].institution, user.referees[2].position];
        user.getPage(2, 4).fields = [user.locationsConsidered, user.curriculaOfInterest, user.ageLevels, user.isJointApplication, user.partnersMemberNumber];
        user.getPage(2, 5).fields = [user.reducedChildFees, user.saveMoneyAbility, user.accommodationProvided, user.healthInsuranceProvided, user.ppdProvided];
        user.getPage(2, 6).fields = [user.numberOfYearsTeachingExperience, user.internationalSchoolExperience, user.currentEmployer, user.currentCountry, user.currentRoles, user.currentSubjects];
        user.getPage(3, 1).fields = [user.computerSkills, user.teachingSkills, user.languages];
        user.getPage(3, 2).fields = [user.teachingCertificates, user.degreeCertificates, user.policeClearanceCertificate,
                                     user.performanceReviewOrRecommendation, user.teachingPhilosophyStatement, user.videos];
        //
        sectionsService.Page.prototype.getPercentageComplete = function() {
          var percentage = (this.isPage(1, 1) ? 10 : 5);
          return (this.getCompletionLevel() > 0 ? percentage : 0);
        };
        //page getCompletionLevel
        sectionsService.Page.prototype.getCompletionLevel = function() { //override this at the page level if this generic function doesn't fit
          if (libService.arr.all(this.fields, function(field) { return field.getIsSufficient(); } )) return 2; //if all fields are sufficient
          if (libService.arr.any(this.fields, function(field) { return field.getIsSufficient(); } )) return 1; //if any field is sufficient
          return 0; //no fields are sufficient
        };
        sectionsService.getPage(3, 2).getCompletionLevel = function() { //override
          if (libService.arr.any(this.fields, function(field) { return field.getIsSufficient(); } )) return 2;
          return 0; //no fields are sufficient
        };
      };
      
      var addFieldDecorators = function() {
        //*** TODO: consider putting the values here into a data structure
        //getTip
        //1.1
        user.roles.getTip = function() { return 'These whiteboard messages will help you create your profile. You can add up to three roles you\'re looking for - but be realistic!'; };
        user.subjects.getTip = function() { return 'Add up to three subjects you would like to teach - but be sure you are qualified to teach them all'; };
        user.subscribe.getTip = function() { return 'We\'ll email you once a week with jobs that match your preferences above'; };
        //1.2
        user.countryCode.getTip = function() { return 'This is the phone dialing code for the country you are currently living in'; };
        user.phoneNumber.getTip = function() { return 'We may occasionally give you a call if a fantastic  opportunity comes up. We promise not to do this often - only if there\'s a great match!'; };
        user.skype.getTip = function() { return 'Skype\'s important so we can speak to you and Heads can interview you. If you don\'t have it, it\'s free and takes ten mins to download. Test sound, mic, light beforehand!'; };
        //1.3
        user.nationality.getTip = function() { return 'Schools need this for visa reasons'; };
        user.teachingQualificationCountry.getTip = function() { return 'This is the country of your teaching qualification / certification. Only qualified teachers will be considered for teaching roles.'; };
        user.educationLevels.getTip = function() { return 'This is where you can add all your brilliant qualifications'; };
        user.availability.getTip = function() { return 'This tells schools if you are actively looking for a job (green) and you can keep some details private by clicking yellow'; };
        user.hasCurrentJob.getTip = function() { return 'Are you currently employed?'; };
        user.availableFrom.getTip = function() { return 'Enter the earliest date you will be available to start a new job'; };
        //1.4
        user.cv.getTip = function() { return 'Adding your CV / r&eacute;sum&eacute; will significantly increase your chances of getting a job with us. Click \'Choose files\' to add your CV / r&eacute;sum&eacute;.'; };
        user.photo.getTip = function() { return 'We recommend adding a photo as it gives personality to your profile. Make sure you look professional. Adding a photo is optional.' };
        //2.1
        user.referees[0].type.getTip = function() { return 'Your referees should be managers. At least one should be from a Head / Principal, ideally your current one.  Most teachers should enter \'Teacher (for most teachers)\''; };
        user.referees[0].name.getTip = function() { return 'Please enter the first name and last name of the person who you\'re requesting a reference from'; };
        user.referees[0].email.getTip = function() { return 'A short reference questionnaire will be sent to your referee automatically -so make sure this email address is correct!'; };
        user.referees[0].institution.getTip = function() { return 'Enter the school or organization where your chosen referee was your manager or supervisor'; };
        user.referees[0].position.getTip = function() { return 'This is the position your referee held when they were your manager or supervisor'; };
        user.referees[0].countryCode.getTip = function() { return 'This is the phone dialing code for the country your referee is currently living in'; };
        user.referees[0].phoneNumber.getTip = function() { return 'This is your referee\'s phone number. Some schools like to have a quick phone conversation to check references.'; };
        //2.2
        user.referees[1].type.getTip = user.referees[0].type.getTip;
        user.referees[1].name.getTip = user.referees[0].name.getTip;
        user.referees[1].email.getTip = user.referees[0].email.getTip;
        user.referees[1].institution.getTip = user.referees[0].institution.getTip;
        user.referees[1].position.getTip = user.referees[0].position.getTip;
        user.referees[1].countryCode.getTip = user.referees[0].countryCode.getTip;
        user.referees[1].phoneNumber.getTip = user.referees[0].phoneNumber.getTip;
        //2.3
        user.referees[2].type.getTip = user.referees[0].type.getTip;
        user.referees[2].name.getTip = user.referees[0].name.getTip;
        user.referees[2].email.getTip = user.referees[0].email.getTip;
        user.referees[2].institution.getTip = user.referees[0].institution.getTip;
        user.referees[2].position.getTip = user.referees[0].position.getTip;
        user.referees[2].countryCode.getTip = user.referees[0].countryCode.getTip;
        user.referees[2].phoneNumber.getTip = user.referees[0].phoneNumber.getTip;
        //2.4
        user.locationsConsidered.getTip = function() { return 'Which parts of the world would you consider teaching in? The more the merrier!'; };
        user.curriculaOfInterest.getTip = function() { return 'Select the curricula you\'d feel most comfortable teaching in your next job'; };
        user.ageLevels.getTip = function() { return 'Which age level of pupils are you qualified to teach?'; };
        user.isJointApplication.getTip = function() { return 'Tick if you\'re planning to move with a husband / wife / partner who\'s also a teacher'; };
        user.partnersMemberNumber.getTip = function() { return 'You can find their 6-digit member number at the top of their profile page'; };
        user.numberOfDependentChildren.getTip = function() { return 'How many children are you bringing along for the adventure?'; };
        user.birthYear.getTip = function() { return 'Sorry for the painful question - you don\'t have to say but schools in some countries need this for visa reasons'; };
        user.maritalStatus.getTip = function() { return 'Schools in some countries need to know your martial status in order to arrange additional visas. This is optional.'; };
        //2.5
        user.reducedChildFees.getTip = function() { return 'How important is it to you that the school you will work in offers a significant discount on school fees for your children?'; };
        user.saveMoneyAbility.getTip = function() { return 'We all want to save money but how much of a priority is it for your move abroad?'; };
        user.accommodationProvided.getTip = function() { return 'Is it important to you that your next school provides extra allowance for accommodation in addition to your salary? '; };
        user.healthInsuranceProvided.getTip = function() { return 'How important is the school covering health insurance to you?'; };
        user.ppdProvided.getTip = function() { return 'This includes training and CPD opportunities and the likelihood of being promoted'; };
        //2.6
        user.numberOfYearsTeachingExperience.getTip = function() { return 'This is the number of complete years you have taught since you qualified'; };
        user.internationalSchoolExperience.getTip = function() { return 'Have you taught overseas before?'; };
        user.curriculumExperience.getTip = function() { return 'Enter up to five different curricula you have taught in the past decade'; };
        user.currentEmployer.getTip = function() { return 'Add the name of your ' + (user.hasCurrentJob.val ? 'current' : 'most recent') + ' school or employer'; };
        user.currentCountry.getTip = function() { return 'Enter the country you ' + (user.hasCurrentJob.val ? 'are currently working in' : 'most recently worked in'); };
        user.currentRoles.getTip = function() { return 'Enter your ' + (user.hasCurrentJob.val ? 'current' : 'most recent') + ' role'; };
        user.currentSubjects.getTip = function() { return 'Enter the subject(s) you ' + (user.hasCurrentJob.val ? 'are teaching in your current school' : 'taught in your most recent school'); };
        user.currentStartDate.getTip = function() { return 'What date did you start working at your ' + (user.hasCurrentJob.val ? 'current' : 'most recent') + ' school?'; };
        user.currentEndDate.getTip = function() { return 'What date did you finish working at your most recent school?'; };
        //3.1
        user.computerSkills.getTip = function() { return 'Which of these pieces of software do you feel confident about using?'; };
        user.teachingSkills.getTip = function() { return 'Let schools know if you have experience in any of these areas'; };
        user.languages.getTip = function() { return 'Having a second language can be seen by employers as massive plus. Do you speak any of these fluently?'; };
        //3.2
        user.teachingCertificates.getTip = function() { return 'Add your teaching certificate / teaching degree / proof of qualified teacher status here (either scan it or take a quality photo)'; };
        user.degreeCertificates.getTip = function() { return 'Add your degree certificates here - you can either scan them or take a photo of them'; };
        user.policeClearanceCertificate.getTip = function() { return 'Add your police clearance document here (scan or photo). This is for schools to check you have no criminal record.'; };
        user.performanceReviewOrRecommendation.getTip = function() { return 'Add appraisals, reviews and lesson observations here. You can add references too but MUST still use our online reference system.'; };
        user.teachingPhilosophyStatement.getTip = function() { return 'Sell yourself! This is a short summary of your education views, teaching ideas and why you wish to teach overseas (we suggest no more than one page).'; };
        user.videos.getTip = function() { return 'Here you can add a personal video - an interview with you or a video of you teaching. Just paste a YouTube link.'; };
   
        //getIsSufficient
        //1.1
        user.roles.getIsSufficient = function() { return user.roles.val.length > 0; };
        user.subjects.getIsSufficient = function() { return user.subjects.val.length > 0; };
        user.subscribe.getIsSufficient = function() { return true; }
        //1.2
        user.countryCode.getIsSufficient = function() { return user.countryCode.val.length > 0; };
        user.phoneNumber.getIsSufficient = function() { return user.phoneNumber.val.length >= 3; };
        user.skype.getIsSufficient = function() { return user.skype.val.length >= 3; };
        //1.3
        user.nationality.getIsSufficient = function() { return user.nationality.val.length > 0; };
        user.teachingQualificationCountry.getIsSufficient = function() { return user.teachingQualificationCountry.val.length > 0; };
        user.educationLevels.getIsSufficient = function() { return user.educationLevels.val.length > 0; };
        //1.4
        user.cv.getIsSufficient = function() { return user.cv.val.length > 0; };
        user.photo.getIsSufficient = function() { return user.photo.val.length > 0; };
        //2.1
        user.referees[0].type.getIsSufficient = function() { return user.referees[0].type.val.length > 0; };
        user.referees[0].name.getIsSufficient = function() { return user.referees[0].name.val.length >= 5; };
        user.referees[0].email.getIsSufficient = function() { return libService.misc.isProbablyValidEmail(user.referees[0].email.val) };
        user.referees[0].institution.getIsSufficient = function() { return user.referees[0].institution.val.length >= 3; };
        user.referees[0].position.getIsSufficient = function() { return user.referees[0].position.val.length > 0; };
        user.referees[0].phoneNumber.getIsSufficient = function() { return user.referees[0].phoneNumber.val.length >= 3; };
        //2.2
        user.referees[1].type.getIsSufficient = function() { return user.referees[1].type.val.length > 0; };
        user.referees[1].name.getIsSufficient = function() { return user.referees[1].name.val.length >= 5; };
        user.referees[1].email.getIsSufficient = function() { return libService.misc.isProbablyValidEmail(user.referees[1].email.val) };
        user.referees[1].institution.getIsSufficient = function() { return user.referees[1].institution.val.length >= 3; };
        user.referees[1].position.getIsSufficient = function() { return user.referees[1].position.val.length > 0; };
        user.referees[1].phoneNumber.getIsSufficient = function() { return user.referees[1].phoneNumber.val.length >= 3; };
        //2.3
        user.referees[2].type.getIsSufficient = function() { return user.referees[2].type.val.length > 0; };
        user.referees[2].name.getIsSufficient = function() { return user.referees[2].name.val.length >= 5; };
        user.referees[2].email.getIsSufficient = function() { return libService.misc.isProbablyValidEmail(user.referees[2].email.val) };
        user.referees[2].institution.getIsSufficient = function() { return user.referees[2].institution.val.length >= 3; };
        user.referees[2].position.getIsSufficient = function() { return user.referees[2].position.val.length > 0; };
        user.referees[2].phoneNumber.getIsSufficient = function() { return user.referees[2].phoneNumber.val.length >= 3; };
        //2.4
        user.locationsConsidered.getIsSufficient = function() { return user.locationsConsidered.val.length > 0; };
        user.curriculaOfInterest.getIsSufficient = function() { return user.curriculaOfInterest.val.length > 0; };
        user.ageLevels.getIsSufficient = function() { return user.ageLevels.val.length > 0; };
        user.numberOfDependentChildren.getIsSufficient = function() { return user.numberOfDependentChildren.val.length > 0; };
        user.birthYear.getIsSufficient = function() { return user.birthYear.val.length > 0; };
        user.maritalStatus.getIsSufficient = function() { return user.maritalStatus.val.length > 0; };
        user.isJointApplication.getIsSufficient = function() { return user.isJointApplication.val.length > 0; };
        user.partnersMemberNumber.getIsSufficient = function() {
          return user.isJointApplication.val[0] !== 1 || user.partnersMemberNumber.val.length >= 6;
        };
        //2.5
        user.reducedChildFees.getIsSufficient = function() { return user.reducedChildFees.val.length > 0; };
        user.saveMoneyAbility.getIsSufficient = function() { return user.saveMoneyAbility.val.length > 0; };
        user.accommodationProvided.getIsSufficient = function() { return user.accommodationProvided.val.length > 0; };
        user.healthInsuranceProvided.getIsSufficient = function() { return user.healthInsuranceProvided.val.length > 0; };
        user.ppdProvided.getIsSufficient = function() { return user.ppdProvided.val.length > 0; };
        //2.6
        user.numberOfYearsTeachingExperience.getIsSufficient = function() { return true; };
        user.internationalSchoolExperience.getIsSufficient = function() { return user.internationalSchoolExperience.val.length > 0; };
        user.currentEmployer.getIsSufficient = function() { return user.currentEmployer.val.length >= 3; };
        user.currentCountry.getIsSufficient = function() { return user.currentCountry.val.length > 0; };
        user.currentRoles.getIsSufficient = function() { return user.currentRoles.val.length > 0; };
        user.currentSubjects.getIsSufficient = function() { return user.currentSubjects.val.length > 0; };
        //3.1
        user.computerSkills.getIsSufficient = function() { return user.computerSkills.val.length > 0; };
        user.teachingSkills.getIsSufficient = function() { return user.teachingSkills.val.length > 0; };
        user.languages.getIsSufficient = function() { return user.languages.val.length > 0; };
        //3.2
        user.teachingCertificates.getIsSufficient = function() { return user.teachingCertificates.val.length > 0; };
        user.degreeCertificates.getIsSufficient = function() { return user.degreeCertificates.val.length > 0; };
        user.policeClearanceCertificate.getIsSufficient = function() { return user.policeClearanceCertificate.val.length > 0; };
        user.performanceReviewOrRecommendation.getIsSufficient = function() { return user.performanceReviewOrRecommendation.val.length > 0; };
        user.teachingPhilosophyStatement.getIsSufficient = function() { return user.teachingPhilosophyStatement.val.length > 0; };
        user.videos.getIsSufficient = function() { return user.videos.val.length > 0; };

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
        //1.4
        user.cv.getClass = function() { return user.cv.getIsSufficient() ? 'isSufficient' : ''; };
        user.photo.getClass = function() { return user.photo.getIsSufficient() ? 'isSufficient' : ''; };
        //2.1
        user.referees[0].name.getClass = function() { return user.referees[0].name.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].email.getClass = function() { return user.referees[0].email.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].institution.getClass = function() { return user.referees[0].institution.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[0].phoneNumber.getClass = function() { return user.referees[0].phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        //2.2
        user.referees[1].name.getClass = function() { return user.referees[1].name.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[1].email.getClass = function() { return user.referees[1].email.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[1].institution.getClass = function() { return user.referees[1].institution.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[1].phoneNumber.getClass = function() { return user.referees[1].phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        //2.3
        user.referees[2].name.getClass = function() { return user.referees[2].name.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[2].email.getClass = function() { return user.referees[2].email.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[2].institution.getClass = function() { return user.referees[2].institution.getIsSufficient() ? 'isSufficient' : ''; };
        user.referees[2].phoneNumber.getClass = function() { return user.referees[2].phoneNumber.getIsSufficient() ? 'isSufficient' : ''; };
        //2.6
        user.currentEmployer.getClass = function() { return user.currentEmployer.getIsSufficient() ? 'isSufficient' : ''; };
        //3.2
        user.teachingCertificates.getClass = function() { return user.teachingCertificates.getIsSufficient() ? 'isSufficient' : ''; };
        user.degreeCertificates.getClass = function() { return user.degreeCertificates.getIsSufficient() ? 'isSufficient' : ''; };
        user.policeClearanceCertificate.getClass = function() { return user.policeClearanceCertificate.getIsSufficient() ? 'isSufficient' : ''; };
        user.performanceReviewOrRecommendation.getClass = function() { return user.performanceReviewOrRecommendation.getIsSufficient() ? 'isSufficient' : ''; };
        user.teachingPhilosophyStatement.getClass = function() { return user.teachingPhilosophyStatement.getIsSufficient() ? 'isSufficient' : ''; };
        user.videos.getClass = function() { return user.videos.getIsSufficient() ? 'isSufficient' : ''; };        
      };

      var addMiscDecorators = function() {
        user.getPercentageComplete = function() {
          var x = 30;
          for (var i=1; i<user.sections.length; i++) {
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
  
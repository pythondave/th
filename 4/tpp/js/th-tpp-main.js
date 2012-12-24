//main module and controllers

angular.module('tpp', ['ui']).
  config(function($routeProvider, $locationProvider) {
    var routeController = function($scope, $routeParams, userService, tipService) {
      $scope.user.visibleSectionId = Number($routeParams.sectionId);
      tipService.clearTip();
      userService.setLocation($routeParams.sectionId, $routeParams.pageId);
      $scope.templateUrl = 'partials/tpp-s' + $routeParams.sectionId + 'p' + $routeParams.pageId + '.html';
    };
  
    $routeProvider.
      when('/:sectionId/:pageId', {
        controller: routeController,
        template: '<div ng-include="templateUrl">Loading...</div>'
      }).
      otherwise({ redirectTo: '/1/1' });
    
    $locationProvider.html5Mode(false); //*** WIP: get true working
  }).
  run(function($rootScope, $location, $timeout, userService, libService, $window, tipService) { //$rootScope definitions
    // *** TODO: tidy this function
    
    $rootScope.user = userService.user;
  
    $rootScope.getScrollFix = function() {
      return 190 + ($rootScope.user.currentLocation.isPage(1, 1) ? 40 : 0);
    };
    
    //tips
    $rootScope.tip = {}; //initialise object
    $rootScope.tip.val = '';
    $rootScope.$on('setTip', function(event, tip) {
      $timeout(function() { tipService.setTip(tip); }, 0);
    });
    $rootScope.focus = function(field) {
      $timeout( function() { tipService.setTip(field.getTip()); });
    };
    $rootScope.blur = function() { tipService.clearTip(); };
    $rootScope.$on('mouseenter', function(event, field) { $rootScope.mouseenter(field); });
    $rootScope.mouseenter = function(field) {
      field.promise = $timeout( function() { tipService.setTip(field.getTip()); }, 500); //set the tip after hovering for 500 ms
    };
    $rootScope.$on('mouseleave', function(event, field) { $rootScope.mouseleave(field); });
    $rootScope.mouseleave = function(field) {
      $timeout.cancel(field.promise); //cancel the mouseenter
    };
    
    //navigation    
    $rootScope.navigateTo = function(sectionId, pageId) {
      if (sectionId === 0) {
        if (pageId === 0) { $window.location = 'http://www.teacherhorizons.com'; }
        if (pageId === 1) { $window.location = '../profile/profile_1.html'; }
        if (pageId === 2) { $window.location = '../settings/settings.html'; }
      }
    };
    
    $rootScope.setLocation = function(sectionId, pageId, allowBeyondFurthestLocation) {
      if (allowBeyondFurthestLocation === undefined) allowBeyondFurthestLocation = true; //default to true
      if (userService.setLocation(sectionId, pageId, allowBeyondFurthestLocation)) {
        $location.path('/' + sectionId + '/' + pageId);
      };
    };
    
    //saving
    $rootScope.$watch('user', function(newValue) { //if anything changes on the user, save it
      userService.save();
    }, true);
    
    //page change event
    $rootScope.$on('$viewContentLoaded', function () {
      tipService.reset();
      libService.window.scroll({ top: 192, increment: 3, interval: 5 }); //scroll
    });
    
    //window resizing
    $rootScope.$watch(libService.window.getWidth, function(newValue) {
      $rootScope.windowWidth = newValue;
    });
    $window.onresize = function() {
      $rootScope.$apply();
    };
  }).
  controller('headerController', function($scope) { }).
  controller('contentContainerController', function($scope, libService) {
    $scope.getStyle = function() { return { minHeight: libService.window.getHeight()-40 } }; //helps to keep the footer at the bottom
  }).
  controller('s1p1Controller', function($scope, roleService, subjectService, tipService, libService, $timeout) {
    tipService.setTip('We\'re here to help! The more you share with us, the greater your chances of finding the best job for you. Once you\'ve completed this section, you can explore jobs worldwide!', { instant: true });
    $scope.roles = roleService.roles;
    $scope.subjects = subjectService.subjects;
    
    //Roles and subjects depend on each other a little... keep them in synch
    $scope.$watch('user.roles.val', function() { $scope.synchRolesAndSubjects(true) });
    $scope.$watch('user.subjects.val', function() { $scope.synchRolesAndSubjects() });
    $scope.synchCounter = 0;
    $scope.synchRolesAndSubjects = function(allowSubjectRemoval) {
      $scope.synchCounter++;
      if ($scope.synchCounter <= 2) return; //hack to prevent synch on page refresh (which would correct an invalid model, but is not the behaviour we want)
      var hasSeniorManagementRole = libService.arr.haveCommonValue($scope.user.roles.val, roleService.seniorManagementRoleIds);
      var hasSeniorManagerSubject = libService.arr.any($scope.user.subjects.val, function(item) { return item === subjectService.seniorManagerId; });
      if (hasSeniorManagementRole && !hasSeniorManagerSubject) {
        $timeout( function() { $scope.user.subjects.val.push(subjectService.seniorManagerId); });
      }
      if (allowSubjectRemoval && !hasSeniorManagementRole && hasSeniorManagerSubject) {
        $timeout( function() { libService.arr.removeValue($scope.user.subjects.val, subjectService.seniorManagerId); });
      }
    }
  }).
  controller('s1p2Controller', function($scope, countryService) {
    $scope.countries = countryService.countries;
    $scope.countriesSelect2FormatFunction = countryService.countriesSelect2FormatFunction;
  }).
  controller('s1p3Controller', function($scope, countryService, educationLevelService) {
    $scope.countries = countryService.countries;
    $scope.countriesSelect2FormatFunction = countryService.countriesSelect2FormatFunction;
    $scope.educationLevels = educationLevelService.educationLevels;
  }).
  controller('s1p4Controller', function($scope) { }).
  controller('s2p1-3Controller', function($scope, referenceTypeService, refereePositionService, countryService) {
    $scope.referenceTypes = referenceTypeService.referenceTypes;
    $scope.refereePositions = refereePositionService.refereePositions;
    $scope.countries = countryService.countries;
    $scope.countriesSelect2FormatFunction = countryService.countriesSelect2FormatFunction;
  }).
  controller('s2p4Controller', function($scope, locationService, curriculumService, ageLevelService,
      numberOfDependentChildrenService, birthYearService, maritalStatusService, yesNoService) {
    $scope.locations = locationService.locations;
    $scope.curricula = angular.copy(curriculumService.curricula);
    $scope.ageLevels = ageLevelService.ageLevels;
    $scope.numberOfDependentChildren = numberOfDependentChildrenService.numberOfDependentChildren;
    $scope.birthYears = birthYearService.birthYears;
    $scope.maritalStatuses = maritalStatusService.maritalStatuses;
    $scope.yesNo = yesNoService.yesNo;
  }).
  controller('s2p5Controller', function($scope, preferenceLevelService) { //*** is there a better way to do this page? (i.e. rather than copying the service x5) - also applies to a few other pages
    $scope.preferenceLevels1 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels2 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels3 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels4 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels5 = angular.copy(preferenceLevelService.preferenceLevels);
  }).
  controller('s2p6Controller', function($scope, curriculumService, countryService, roleService, subjectService, yesNoService) {
    $scope.curricula = angular.copy(curriculumService.curricula);
    $scope.countries = countryService.countries;
    $scope.countriesSelect2FormatFunction = countryService.countriesSelect2FormatFunction;
    $scope.roles = roleService.roles;
    $scope.subjects = subjectService.subjects;
    $scope.yesNo = yesNoService.yesNo;
    
    $scope.getEmployerPrefix = function() {
      return ($scope.user.hasCurrentJob.val ? 'Current' : 'Most recent')
    }
  }).
  controller('s3p1Controller', function($scope, computerSkillService, teachingSkillService, languageService) {
    $scope.computerSkills = computerSkillService.computerSkills;
    $scope.teachingSkills = teachingSkillService.teachingSkills;
    $scope.languages = languageService.languages;
  }).
  controller('s3p2Controller', function($scope) { }).
  controller('pageAsideController', function($scope) {
    $scope.getStyle = function() {
      var left = Math.max(($scope.windowWidth-960)/2, 8) + 638;
      return { left: left };
    }
  }).
  controller('tipsController', function($scope, tipService) {
    $scope.tip = tipService.tip;
  }).
  controller('summaryController', function($scope, $location, $route, userService) {
    $scope.sectionClick = function(sectionId) {
      var section = $scope.user.getSection(sectionId);
      if ( !section.getIsVisited() ) return; //not clickable, so we're done
      $scope.user.visibleSectionId = (sectionId === $scope.user.visibleSectionId ? undefined : sectionId); //toggle section visibility
      if (sectionId === 0) { return; } //profile section, so we're done
      if (sectionId === $scope.user.currentLocation.sectionId) return; //current section, so we're done
      $scope.setLocation(sectionId, 1, false); //switch to page 1 of different section
    };
    
    $scope.getStyle = function(sectionId) { //returns the height of a current section, o/w nothing
      var section = $scope.user.getSection(sectionId);
      return { height: section.getHeightInPixels() + 'px' };
    };
    
    $scope.getClass = function(sectionId, pageId, typeId) {
      //returns the class of a particular section or page element based on user data
      //class types include: isCurrent, isVisited (true after first visit) and completionLevel2 (true if all elements are "sufficient")
      typeId = typeId || 1;
      var s, page, isCurrent, isVisited, completionLevel2;
      var category = ( pageId ? 'page' : 'section' );
      var section = $scope.user.getSection(sectionId);

      if (category == 'section') {
        if (typeId == 1) { //section (outer)
          s = 'section';
          s += ' section' + sectionId;
          s += (section.getIsCurrent() ? ' section-isCurrent' : '');
          s += (section.getIsVisited() ? ' section-isVisited' : '');
        } else if (typeId == 2) { //sectionTitle
          s = 'sectionTitle';
        } else if (typeId == 3) { //sectionInner
          s = 'sectionInner ease-in-out-500';
          s += (section.id === $scope.user.visibleSectionId ? ' sectionInner-isVisible' : ' sectionInner-notVisible');
        };
      } else if (category == 'page') {
        page = section.pages[pageId-1];
        if (typeId == 1) { //page (outer)
          s = 'page ' + ( page && page.getIsVisited() ? ' page-isVisited' : '' );
        } else if (typeId == 2) { //pageTitle
          s = 'pageTitle';
          s += (page.getIsCurrent() ? ' page-isCurrent' : '');
          s += (page.getCompletionLevel() === 2 ? ' page-completionLevel2' : '');
        };
      };
      
      return s;
    };
  }).
  controller('devController', function($scope, userService) {
    $scope.resetUser = function() {
      userService.resetUser();
      $location.path('');
    };
    
    $scope.deleteUser = function() {
      userService.deleteUser();
      window.location.href = 'default.html';
    };
  });
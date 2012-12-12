//main module and controllers

angular.module('tpp', ['ui']).
  config(function($routeProvider, $locationProvider) {
  
    var routeController = function($scope, $routeParams, userService) {
      userService.setLocation($routeParams.sectionId, $routeParams.pageId);
      $scope.templateUrl = 'partials/tpp-s' + $routeParams.sectionId + 'p' + $routeParams.pageId + '.html'
    };
  
    $routeProvider.
      when('/:sectionId/:pageId', {
        controller: routeController,
        template: '<div ng-include="templateUrl">Loading...</div>'
      }).
      otherwise({ redirectTo: '/1/1' });
    
    $locationProvider.html5Mode(false); //*** WIP: get true working
  }).
  run(function($rootScope, $location, $timeout, userService) { //$rootScope definitions
  
// *********************** WIP    
  $rootScope.setTip = function(tip) {
    //blank the tip, transition to the alternate state and wait
    $rootScope.user.tip = '';
    if (!tip || tip === '') return;
    $rootScope.tipTransition = {};
    $rootScope.tipTransition.classes = 'border-style-solid border-color-black-0 ease-in-out-200 tip-alternate-state';
    $timeout(function() { $rootScope.setTipStep2(tip) }, 200*1.1);
  };
  $rootScope.setTipStep2 = function(tip) {
    //transition back to the main state and wait
    $rootScope.tipTransition.classes = 'border-style-solid border-color-black-10 ease-in-out-500 tip-main-state';
    $timeout(function() { $rootScope.user.tip = tip }, 500);
  };
//***************************


    $rootScope.user = userService.user;
    
    $rootScope.$on('setTip', function(event, tip) {
      var delay = (!tip || tip === '' ? 0 : 20); //add a slight delay when setting a non-blank tip to ensure that gets set last, and to not interfere with select2 timeouts (which are 10ms)
      $timeout(function() { $rootScope.setTip(tip); }, 0);
    });
    $rootScope.focus = function(field) {
      $timeout( function() { $rootScope.setTip(field.getTip()); });
    };
    $rootScope.blur = function() { $rootScope.setTip(''); };
    
    $rootScope.moveNext = function() {
      var nextPage = userService.user.currentLocation.getNext();
      $rootScope.setLocation(nextPage.sectionId, nextPage.id);
    };
    
    $rootScope.setLocation = function(sectionId, pageId, allowBeyondFurthestLocation) {
      if (allowBeyondFurthestLocation === undefined) allowBeyondFurthestLocation = true; //default to true
      if (userService.setLocation(sectionId, pageId, allowBeyondFurthestLocation)) {
        $location.path('/' + sectionId + '/' + pageId);
      };
    };
    
    $rootScope.$watch('user', function(newValue) { //if anything changes on the user, save it
      userService.save();
    }, true);
  }).
  controller('s0p1Controller', function($scope) { }).
  controller('s0p2Controller', function($scope) { }).
  controller('s1p1Controller', function($scope, roleService, subjectService) {
    $scope.roles = roleService.roles;
    $scope.subjects = subjectService.subjects;
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
  controller('s1p4Controller', function($scope) {
    $scope.setCVFiles = function(element) {
      $scope.$apply(function($scope) {
          $scope.user.cv.files = element.files;
      });
    };
    $scope.setPhotoFiles = function(element) {
      $scope.$apply(function($scope) {
          $scope.user.photo.files = element.files;
      });
    };
  }).
  controller('s2p1-3Controller', function($scope, referenceTypeService, refereePositionService, countryService) {
    $scope.referenceTypes = referenceTypeService.referenceTypes;
    $scope.refereePositions = refereePositionService.refereePositions;
    $scope.countries = countryService.countries;
    $scope.countriesSelect2FormatFunction = countryService.countriesSelect2FormatFunction;
  }).
  controller('s2p4Controller', function($scope, locationService, curriculumService, ageLevelService,
      numberOfDependentChildrenService, birthYearService, maritalStatusService, yesNoService) {
    $scope.locations = locationService.locations;
    $scope.curricula = curriculumService.curricula;
    $scope.ageLevels = ageLevelService.ageLevels;
    $scope.numberOfDependentChildren = numberOfDependentChildrenService.numberOfDependentChildren;
    $scope.birthYears = birthYearService.birthYears;
    $scope.maritalStatuses = maritalStatusService.maritalStatuses;
    $scope.yesNo = yesNoService.yesNo;
  }).
  controller('s2p5Controller', function($scope, preferenceLevelService) { //*** is there a better way to do this page? (i.e. rather than copying the service x5)
    $scope.preferenceLevels1 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels2 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels3 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels4 = angular.copy(preferenceLevelService.preferenceLevels);
    $scope.preferenceLevels5 = angular.copy(preferenceLevelService.preferenceLevels);
  }).
  controller('s2p6Controller', function($scope) {
  }).
  controller('s3p1Controller', function($scope, computerSkillService, teachingSkillService, languageService) {
    $scope.computerSkills = computerSkillService.computerSkills;
    $scope.teachingSkills = teachingSkillService.teachingSkills;
    $scope.languages = languageService.languages;
  }).
  controller('s3p2Controller', function($scope) {
  }).
  controller('tipsController', function($scope, userService) {
  }).
  controller('summaryController', function($scope, $location, $route, userService) {
    
    $scope.getClass = function(sectionId, pageId, typeId) {
      //returns the class of a particular section or page element based on user data
      //class types include: isCurrent, isVisited (true after first visit) and completionLevel2 (true if all elements are sufficient)
      typeId = typeId || 1;
      var s, page, isCurrent, isVisited, completionLevel2;
      var category = ( pageId ? 'page' : 'section' );
      var section = $scope.user.getSection(sectionId);

      if (category == 'section') {
        if (typeId == 1) {
          s = 'section';
          s += ' section' + sectionId;
          s += (section.getIsCurrent() ? ' section-isCurrent' : '');
          s += (section.getIsVisited() ? ' section-isVisited' : '');
        } else if (typeId == 2) {
          s = 'sectionTitle';
        } else if (typeId == 3) {
          s = 'sectionInner ease-in-out-500';
          s += (section.getIsCurrent() ? ' sectionInner-isCurrent' : ' sectionInner-notCurrent');
        };
      } else if (category == 'page') {
        page = section.pages[pageId-1];
        if (typeId == 1) {
          s = 'page ' + ( page && page.getIsVisited() ? ' page-isVisited' : '' );
        } else if (typeId == 2) {
          s = 'pageTitle';
          s += (page.getIsCurrent() ? ' page-isCurrent' : '');
          s += (page.getCompletionLevel() === 2 ? ' page-completionLevel2' : '');
        };
      };
      
      return s;
    };
  }).
  controller('devController', function($scope, userService) {
    //reminder: controllers should not touch the dom (instead use directives)
    $scope.resetUser = function() {
      userService.resetUser();
      $location.path('');
    };
    
    $scope.deleteUser = function() {
      userService.deleteUser();
      window.location.href = '/th/4/default.html';
    };
  });
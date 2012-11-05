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
    $rootScope.user = userService.user;
    
    $rootScope.$on('setTip', function(event, tip) {
      var f = function() { $rootScope.user.tip = tip; $rootScope.$apply(); };
      if ( !tip || tip === '' ) { f(); } else { $timeout( f ); }
    });
    $rootScope.focus = function(field) {
      $timeout( function() { $rootScope.user.tip = field.getTip(); });
    };
    $rootScope.blur = function() { $rootScope.user.tip = ''; };
    
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
  controller('s1p1Controller', function($scope, roleService, subjectService) {
    $scope.roles = roleService.roles;
    $scope.subjects = subjectService.subjects;
  }).
  controller('s1p2Controller', function($scope, countryService) {
    $scope.countries = countryService.countries;
  }).
  controller('s1p3Controller', function($scope, countryService, educationLevelService) {
    $scope.countries = countryService.countries;
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
    //reminder: controllers should not touch the dom (instead use directives)

    $scope.resetUser = function() {
      userService.resetUser();
      $location.path('');
    };
    
    $scope.deleteUser = function() {
      userService.deleteUser();
      window.location.href = '/th/3/default.html';
    };
    
    $scope.getClass = function(sectionId, pageId, typeId) {
      //returns the class of a particular section or page element based on user data
      //class types include: isCurrent, isVisited (true after first visit) and completionLevel2 (true if all elements are sufficient)

      typeId = typeId || 1;
      var s, page, isCurrent, isVisited, completionLevel2;
      var category = ( pageId ? 'page' : 'section' );
      var section = $scope.user.getSection(sectionId);

      if (category == 'section') {
        if (typeId == 1) {
          s = 'section' + (section.getIsCurrent() ? ' section-isCurrent' : '') + (section.getIsVisited() ? ' section-isVisited' : '');
        } else if (typeId == 2) {
          s = 'sectionTitle';
        } else if (typeId == 3) {
          s = 'sectionInner' + (section.getIsCurrent() ? ' sectionInner-isCurrent' : '');
        };
      } else if (category == 'page') {
        page = section.pages[pageId-1];
        if (typeId == 1) {
          s = 'page ' + ( page && page.getIsVisited() ? ' page-isVisited' : '' );
        } else if (typeId == 2) {
          s = 'pageTitle' + (page.getIsCurrent() ? ' page-isCurrent' : '') + (page.getCompletionLevel() === 2 ? ' page-completionLevel2' : '');
        };
      };
      
      return s;
    };
  });
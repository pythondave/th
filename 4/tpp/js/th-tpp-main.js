//main module and controllers

angular.module('tpp', ['ui']).
  config(function($routeProvider, $locationProvider) {
  
    var routeController = function($scope, $routeParams, userService, $rootScope) {
      $scope.user.visibleSectionId = Number($routeParams.sectionId);
      $scope.setTip('');
      $rootScope.pageLoadTime = new Date().getTime();
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
  run(function($rootScope, $location, $timeout, userService) { //$rootScope definitions
    // *** TODO: tidy this function (consider adding a tips service)
  
    // *********************** WIP
      $rootScope.setTip = function(tip) {
        //blank the tip, transition to the alternate state and wait
        if (tip === $rootScope.user.tip) return; //tip not changing, so we're done
        $rootScope.user.tip = '';
        if (!tip || tip === '') return;
        $rootScope.tipTransition = {};
        $rootScope.tipTransition.classes = 'border-style-solid border-color-black-0 ease-in-out-200 tip-alternate-state';
        $timeout(function() { $rootScope.setTipStep2(tip) }, 200*1.1);
      };
      $rootScope.setTipStep2 = function(tip) {
        //transition back to the main state and wait
        $rootScope.tipTransition.classes = 'border-style-solid border-color-black-10 ease-in-out-500 tip-main-state';
        $timeout(function() {
          if (tip === 'Continue to the next page...' && ((new Date().getTime()) - $rootScope.pageLoadTime) < 1000) tip = ''; //hack to prevent 'continue' tip from displaying as next page loads
          $rootScope.user.tip = tip
        }, 500);
      };
    //***************************

    $rootScope.getScrollFix = function() {
      return 185 + ($rootScope.user.currentLocation.isPage(1, 1) ? 35 : 0);
    };
    
    $rootScope.user = userService.user;
    
    $rootScope.btnContinue = { getTip: function() {
      if ($rootScope.user.currentLocation.isPage(1, 1)) return 'Great start, on to the next section!'
      return 'Continue to the next page...'; }
    };
    $rootScope.btnDoLater = { getTip: function() {
      return 'Go to the home page - you can come back to this later :)'; }
    };
    
    //tips
    $rootScope.$on('setTip', function(event, tip) {
      var delay = (!tip || tip === '' ? 0 : 20); //add a slight delay when setting a non-blank tip to ensure that gets set last, and to not interfere with select2 timeouts (which are 10ms)
      $timeout(function() { $rootScope.setTip(tip); }, 0);
    });
    $rootScope.focus = function(field) {
      $timeout( function() { $rootScope.setTip(field.getTip()); });
    };
    $rootScope.blur = function() { $rootScope.setTip(''); };
    $rootScope.$on('mouseenter', function(event, field) { $rootScope.mouseenter(field); });
    $rootScope.mouseenter = function(field) {
      field.promise = $timeout( function() { $rootScope.setTip(field.getTip()); }, 500); //set the tip after hovering for 500 ms
    };
    $rootScope.$on('mouseleave', function(event, field) { $rootScope.mouseleave(field); });
    $rootScope.mouseleave = function(field) {
      $timeout.cancel(field.promise); //cancel the mouseenter
    };
    
    //navigation    
    $rootScope.navigateTo = function(sectionId, pageId) {
      if (sectionId === 0) {
        if (pageId === 1) { window.location = '../profile/profile_1.html'; }
        if (pageId === 2) { window.location = '../settings/settings.html'; }
      }
    };
    
    $rootScope.setLocation = function(sectionId, pageId, allowBeyondFurthestLocation) {
      if (allowBeyondFurthestLocation === undefined) allowBeyondFurthestLocation = true; //default to true
      if (userService.setLocation(sectionId, pageId, allowBeyondFurthestLocation)) {
        $location.path('/' + sectionId + '/' + pageId);
      };
    };
    
    $rootScope.doLater = function() {
      window.location = 'http://www.teacherhorizons.com'
    };
    
    //saving
    $rootScope.$watch('user', function(newValue) { //if anything changes on the user, save it
      userService.save();
    }, true);
  }).
  controller('headerController', function($scope) { }).
  controller('s1p1Controller', function($scope, roleService, subjectService, $window) {
    $scope.roles = roleService.roles;
    $scope.subjects = subjectService.subjects;
    $window.scrollTo(0, 195);
  }).
  controller('s1p2Controller', function($scope, countryService, $timeout, $window) {
    $scope.setTip('');
    $scope.countries = countryService.countries;
    $scope.countriesSelect2FormatFunction = countryService.countriesSelect2FormatFunction;
    $window.scrollTo(0, 195);
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
  controller('tipsController', function($scope, userService) { }).
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
    //reminder: controllers should not touch the dom (instead use directives)
    $scope.resetUser = function() {
      userService.resetUser();
      $location.path('');
    };
    
    $scope.deleteUser = function() {
      userService.deleteUser();
      window.location.href = 'default.html';
    };
  });
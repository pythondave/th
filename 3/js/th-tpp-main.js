/* *** Main WIP - lots to learn and incorporate!

    * learn about and incorporate forms
*/
function RouteCtrl($scope, $routeParams, userService) {
    userService.setLocation($routeParams.sectionId, $routeParams.pageId);
    $scope.templateUrl = 'partials\\tpp-s' + $routeParams.sectionId + 'p' + $routeParams.pageId + '.html'
};

angular.module('tpp', ['ui']).
    config(function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/:sectionId/:pageId', {
                controller: RouteCtrl,
                template: '<div ng-include="templateUrl">Loading...</div>'
            }).
            otherwise({ redirectTo: '/1/1' });

        $locationProvider.html5Mode(false); //*** WIP: get true working
    }).
    controller('mainController', function($scope, $location, $routeParams, $timeout, userService,
        roleService, subjectService, countryService) {
        //reminder: controllers should not touch the dom (instead use directives)

        ////scope variables
        $scope.user = userService.user;
        
        if ($location.$$path == '/1/1') { //*** TODO: consider having a different controller for each page, with common elements in rootScope
            $scope.roles = roleService.roles;
            $scope.subjects = subjectService.subjects;
        };
        if ($location.$$path == '/1/2' || $location.$$path == '/1/3') {
            $scope.countries = countryService.countries;
        };
        ////
        
        ////scope functions
        $scope.moveNext = function() {
            var path = userService.user.currentLocation.moveNext().getPath();
            $location.path(path);
        };
        
        $scope.setLocation = function(sectionId, pageId) {
            userService.setLocation(sectionId, pageId);
            $location.path('/' + sectionId + '/' + pageId);
        };
        
        $scope.$watch('user', function(newValue) { //if anything changes on the user, save it
            userService.save();
        }, true);
        
        //*** temporary hack until select2 control is improved by angular people (or by me when I have time)
        $scope.$watch('user.roles', function(newValue) { tempSelect2Function(newValue.elemId) }, true);
        $scope.$watch('user.subjects', function(newValue) { tempSelect2Function(newValue.elemId) }, true);

        var tempSelect2Function = function(elemId) {
            $timeout(function() {
                var elems = $('#' + elemId).parent().children();
                var input = elems.eq(1);
                var div = elems.eq(2);
                if (div) { div.toggleClass('isSufficient', input.hasClass('isSufficient')); }
            });
        };
        //
        
        ////
    }).
    controller('summaryController', function($scope, $location, userService) {
        //reminder: controllers should not touch the dom (instead use directives)

        ////scope variables
        $scope.user = userService.user;
        ////

        ////scope functions
        $scope.resetUser = function() {
            userService.reset();
            $location.path('/1/1');
        };
        
        $scope.setLocation = function(sectionId, pageId) {
            userService.setLocation(sectionId, pageId);
            $location.path('/' + sectionId + '/' + pageId);
        };
        
        $scope.getClass = function(sectionId, pageId, typeId) {
            //returns the class of a particular section or page element based on user data
            //class types include: isCurrent, isVisited (true after first visit) and isSufficient (true if all elements are sufficient)

            typeId = typeId || 1;
            var s, page, isCurrent, isVisited, isSufficient;
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
                    s = 'pageTitle' + (page.getIsCurrent() ? ' page-isCurrent' : '') + (page.getIsSufficient() ? ' page-isSufficient' : '');
                };
            };
            
            return s;
        };
        ////
    });
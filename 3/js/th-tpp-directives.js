/* *** Directives WIP - lots to learn and incorporate!

  * learn about incorporating within forms
  * learn about and incorporate built-in validation (e.g. ng-maxlength)
  * learn about and incorporate custom validation
*/

angular.module('tpp').
  directive('onFocus', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attr) {
        element.bind('focus', function() {
          $scope.$apply(attr.onFocus);
        });
      }
    };    
  }).
  directive('onBlur', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attr) {
        element.bind('blur', function() {
          $scope.$apply(attr.onBlur);
        });
      }
    };    
  }).
  directive('moveNext', function() {
    return {
      restrict: 'EAC',
      replace: true,
      scope: true,
      template: '<button class="btn btn-primary" ng-click="$parent.moveNext()">Continue</button>'
    }
  }).
  directive('devHelper1', function() {
    return {
      restrict: 'EAC',
      replace: false,
      templateUrl: 'partials/directives/devHelper1.html'
    }
  }).
  directive('devHelper2', function() {
    return {
      restrict: 'EAC',
      replace: true,
      template: '<div ng-show="user.dev"><div class="moveNext"></div><div class="devHelper1"></div></div>'
    }
  }).
  directive('textInput', function() {
    return {
      restrict: 'C', transclude: true, replace: true,
      scope: { label: '@label', required: '@required' },
      template:
        '<div>' +
          '<label>{{label}}</label>' +
          '<input type="text" {{required}} ng-maxlength="10"></input>' +
        '</div>',
      link: function($scope, element, attr, ctrl) {
        return undefined;
      }
    };
  }).
  directive('multiSelect1', function() {
    return {
      restrict: 'C', transclude: true, replace: true,
      scope: { label:'@label' },
      template:
        '<div>' +
          '<label>{{label}}</label>' +
          '<select ui-select2 ng-model="select2" required>' +
        '</div>'
    };
  }).
  directive('select', function() {
    return {
      restrict: 'C', transclude: true, replace: true,
      scope: { label:'@label' },
      template:
        '<div>' +
          '<label>{{label}} - {{value}}</label>' +
          '<select ui-select2 ng-model="value">' +
            '<option>x</option>' +
            '<option ng-repeat="subject in subjects">{{subject}}</option>' +
          '</select>' +
        '</div>'
    };
  }).
  directive('checkboxes', function() {
    return {
      restrict: 'A',
      templateUrl: 'partials/directives/checkboxes.html',
      scope: { list: '=', selection: '=' },
      transclude: true,
      link: function($scope, element, attr, ctrl) {
        //init list based on selection
        angular.forEach($scope.list, function(item) {
          if ($scope.selection.indexOf(item.id)>=0) { item.isSelected = true; }
        });
        
        $scope.getClass = function(item) {
          return (item.isSelected ? (attr.checkedClass || 'btn-success') : '');
        };
        
        //synch selection to list
        $scope.synchSelection = function() {
          var arr = [];
          angular.forEach($scope.list, function(item) {
            if (item.isSelected) arr.push(item.id);
          });
          $scope.selection = arr;
        };
      }
    };
  });

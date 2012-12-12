//

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
  directive('devHelper1', function() {
    return {
      restrict: 'EAC',
      replace: false,
      templateUrl: 'partials/directives/devHelper1.html'
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
  });
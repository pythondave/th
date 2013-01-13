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
  directive('doLater', function() {
    //*** WIP - create a popup
    return {
      restrict: 'C',
      replace: true,
      template: '<span><input type="button" class="btn" ng-click="navigateTo(0, 0)" tip="Go to the home page - you can come back to this later :)" value="Do Later"></input></span>',
      link: function($scope, element, attr, ctrl) {
      }
    }
  }).
  directive('tip', function() {
    return {
      restrict: 'A',
      replace: false,
      link: function($scope, element, attr, ctrl) {
        var tipObject = { getTip: function() { return attr.tip; } };
        element.bind('mouseenter', function() { $scope.mouseenter(tipObject); });
        element.bind('mouseleave', function() { $scope.mouseleave(tipObject); });
      }
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
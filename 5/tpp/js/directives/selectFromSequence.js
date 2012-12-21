angular.module('tpp')
  .directive('selectFromSequence', function($timeout) {
    return {
      restrict: 'AC',
      scope: { ngModel: '=' },
      link: function($scope, element, attr, ctrl) {
        var options = {};
        if (attr.selectFromSequence) { angular.extend(options, $scope.$eval(attr.selectFromSequence)); }
        if (attr.options) { angular.extend(options, $scope.$eval(attr.options)); }

        options.value = $scope.ngModel;
        options.values = $scope.ngModel;
        options.slide = function(event, ui) {
          $timeout( function() {
            $scope.ngModel = (options.range === true ? ui.values : ui.value);
            $scope.$apply();
          });
        };
        if (options.tip) {
          options.start = function() { $scope.$emit('setTip', options.tip); };
          options.stop = function() { $scope.$emit('setTip'); };
        }

        element.slider(options);
      }
    };
  });

//

angular.module('tpp')
  .directive('selectFiles', function($timeout) {
    return {
      restrict: 'AC',
      templateUrl: 'partials/directives/selectFiles.html',
      scope: { field: '=' },
      link: function($scope, element, attr, ctrl) {
        $scope.change = function(element) {
          $timeout( function() {
            if (element.files) { //certain browsers (html5)
              $scope.field.val.push.apply($scope.field.val, element.files);
            } else { //other browsers
              var file = {};
              file.name = element.value.replace('C:\\fakepath\\', '');
              $scope.field.val.push(file);
            }
          });
        };
        $scope.deleteFile = function(file, index) {
          $scope.field.val.splice(index, 1);
        };
        //bind events
        $scope.mouseenter = function() { $scope.$emit('mouseenter', $scope.field); };
        $scope.mouseleave = function() { $scope.$emit('mouseleave', $scope.field); };
      }
    };
  });

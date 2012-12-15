//*** WIP
angular.module('tpp')
  .directive('selectFiles', function($timeout) {
    return {
      restrict: 'AC',
      scope: { ngModel: '=' },
      link: function($scope, element, attr, ctrl) {
      }
    };
  });

angular.module('tpp')
  .directive('selectFromMany', function ($timeout) {
    return {
      restrict: 'AC',
      templateUrl: 'partials/directives/selectFromMany.html',
      scope: { list: '=', field: '=', format: '=' },
      transclude: false,
      link: function($scope, element, attr, ctrl) {
        var selectElement = $(element.children()[0]);
        var select2 = selectElement.select2();

        if (attr.multiple === '') {
          angular.element(selectElement).attr('multiple', '');
          if (!$scope.field.val) $scope.field.val = [];
        }
        
        var isSufficient = $scope.field.isSufficient || function() {
          var val = $scope.field.val;
          return !(!val || val.length===0);
        };
        
        var setClass = function() {
          var div = element.find('div').eq(0);
          div.toggleClass('isSufficient', isSufficient());
          div.removeClass('select2-container-active');
        };
        
        $timeout(function() {
          options = {};
          options.maximumSelectionSize = attr.maxSelect;
          options.placeholder = attr.placeholder;
          options.allowClear = attr.allowClear || true;
          if ($scope.format) {
            options.formatResult = $scope.format;
            options.formatSelection = $scope.format;
          }
          if (isSufficient()) { options.containerCssClass = 'isSufficient'; }
          select2.val($scope.field.val).select2(options);
        });
        
        element.bind('open', function () {
          var tip = ($scope.field.getTip ? $scope.field.getTip() : '');
          $scope.$emit('setTip', tip);
        });
        //element.bind('close', function () { $scope.$emit('setTip'); });
        element.bind('change', function () {
          $scope.$apply(function() {
            $scope.field.val = (select2.val() === null ? [] : select2.val());
          });
          setClass();
          //$scope.$emit('setTip');
        });
      }
    };
  });

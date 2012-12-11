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
  directive('selectManyFromFew', function() {
    return {
      restrict: 'A',
      templateUrl: 'partials/directives/selectManyFromFew.html',
      scope: { list: '=', selection: '=' },
      transclude: true,
      link: function($scope, element, attr, ctrl) {

        //init list based on selection
        angular.forEach($scope.list, function(item) {
          if ($scope.selection.indexOf(item.id)>=0) { item.isSelected = true; }
        });
        
        //if list changes, synch selection
        $scope.$watch('list', function(newValue, oldValue) {
          $scope.synchSelection();
        }, true);

        //if selection breaks the rules, change the list
        $scope.$watch('selection', function(newValue, oldValue) {
          var maxSelect = Number(attr.maxSelect);
          if (maxSelect && $scope.selection.length > maxSelect) {
            var item = getById($scope.list, $scope.selection[0]);
            if (item) item.isSelected = false;
          }
        }, true);

        $scope.getClass = function(item) {
          return (item.isSelected ? (attr.checkedClass || 'btn-success') : '');
        };
        
        //generic function
        var getById = function(arrayOfObjects, id) {
          for(var i=0; i<arrayOfObjects.length; i++) {
            if (arrayOfObjects[i].id == id) return arrayOfObjects[i];          
          }
        };

        //synch selection to list (and keep the order of selection)
        $scope.synchSelection = function() {
          angular.forEach($scope.list, function(item) {
            var ind = $scope.selection.indexOf(item.id); //index of item in selection
            if (item.isSelected && ind === -1) $scope.selection.push(item.id); //selected but didn't exist => add
            if (!item.isSelected && ind > -1) $scope.selection.splice(ind, 1); //not selected but existed => remove
          });
        };
      }
    };
  });
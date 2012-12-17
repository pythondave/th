//

angular.module('tpp')
  .directive('selectManyFromFew', function() {
    return {
      restrict: 'AC',
      templateUrl: 'partials/directives/selectManyFromFew.html',
      scope: { list: '=', field: '=' },
      transclude: true,
      link: function($scope, element, attr, ctrl) {
        $scope.selection = $scope.field.val;

        //bind events
        element.bind('mouseenter', function() { $scope.$emit('mouseenter', $scope.field); });
        element.bind('mouseleave', function() { $scope.$emit('mouseleave', $scope.field); });
        
        //init list based on selection
        angular.forEach($scope.list, function(item) {
          if ($scope.selection.indexOf(item.id)>=0) { item.isSelected = true; }
        });
        
        //if list changes, synch selection and show/hide isSufficient class
        $scope.$watch('list', function(newValue, oldValue) {
          $scope.synchSelection();
          element.toggleClass('isSufficient', $scope.selection.length > 0);
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
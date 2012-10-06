var th = th || {};
th.tpp = th.tpp || {};

th.tpp.controller = {
	init: function(options) {
		this.dataModel = th.tpp.dataModel.init();
		this.viewModel = th.tpp.viewModel.init({ dataModel: this.dataModel });

		this.views = th.tpp.views;
		this.views.init({ mainContainer: $('#mainSection article'), tipsContainer: $('#tipsSection article'), summaryContainer: $('#summarySection article') });
		this.views.main.render({ viewModel: this.viewModel });
		this.views.tips.render({ tip: '' });
		this.views.summary.render({ viewModel: this.viewModel });
	}
};

$(document).ready(function() {
    th.tpp.controller.init();
});

angular.module('tpp', []).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:TppCtrl, templateUrl:'templates\\tpp-s1p1.html'}).
            when('/1/1', {controller:TppCtrl, templateUrl:'templates\\tpp-s1p1.html'}).
            when('/1/2', {controller:TppCtrl, templateUrl:'templates\\tpp-s1p2.html'}).
            otherwise({redirectTo:'/'});
    }).
    directive('textInput', function() {
        return {
            restrict: 'E', transclude: true, replace: true,
            scope: { label: '=' },
            template:
                '<div>' +
                    '<label>{{label.name}}</label>' +
                    '<input type="text"></input>' +
                '</div>'
        };
    });

function TppCtrl($scope, $location) {
    $scope.next = function() {
        $location.path('/1/2');
    };
};

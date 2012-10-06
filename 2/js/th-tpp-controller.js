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

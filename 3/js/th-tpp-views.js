var th = th || {};
th.tpp = th.tpp || {};

th.tpp.views = {
	init: function(options) {
		this.main.init({ container: options.mainContainer });
		this.tips.init({ container: options.tipsContainer });
		this.summary.init({ container: options.summaryContainer });
	},
	main: {
		init: function(options) {
			this.container = options.container;
		},
		render: function(options) {
			//this.container.html(options.viewModel.getCurrentPage().getMainHtml());
		}
	},
	tips: {
		init: function(options) {
			this.container = options.container;
		},
		render: function(options) {
			this.container.html(options.tip);
		}
	},
	summary: {
		init: function(options) {
			this.container = options.container;
		},
		render: function(options) {
			this.container.html(options.viewModel.sections.getSummaryHtml());
		}
	},
    renderAll: function(options) {
		this.main.render(options);
		this.summary.render(options);
		this.tips.render(options);
    }
};
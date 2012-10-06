var th = th || {};
th.tpp = th.tpp || {};

th.tpp.dataModel = {
	init: function() {
        if (localStorage.getItem('th.tpp.dataModel.currentLocationGuid') === null ) { //nothing stored -> set for first use
            this.currentLocationGuid = this._userDataFirstUse.currentLocationGuid;
            this.sections = this._userDataFirstUse.sections;
            this._save();
        };
        this.currentLocationGuid = localStorage.getItem('th.tpp.dataModel.currentLocationGuid');
        this.sections = JSON.parse(localStorage.getItem('th.tpp.dataModel.sections'));
		return this;
	},
    set: function(options) {
        if (options.field) {
            var field = options.field;
            field.getPageData()[field.id] = options.value;
        } else if (options.page) {
            if (options.isVisited) { options.page.getData().isVisited = options.isVisited; };
            if (options.currentLocationGuid) { this.currentLocationGuid = options.currentLocationGuid; };
        };
        this._save();
    },
    _save: function() {
        localStorage.setItem('th.tpp.dataModel.currentLocationGuid', this.currentLocationGuid);
        localStorage.setItem('th.tpp.dataModel.sections', JSON.stringify(this.sections));
        setTimeout(this.saveCallback(), 1000); //simulate a network delay
    },
    saveCallback: function() {
        console.log('WIP - saveCallback', this);
    },
    resetUserData: function() {
        localStorage.clear();
    },
	_userDataFirstUse: {
        currentLocationGuid: 's1-p1',
        sections: [
            {	id: 1,
                pages: [
                    { id: 1, isVisited: true },
                ]
            },
            {	id: 2,
                pages: [
                ]
            },
            {	id: 3,
                pages: [
                ]
            }
        ]
    }
};

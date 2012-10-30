var th = th || {};
th.tpp = th.tpp || {};

th.tpp.viewModelConstructors = {
  init: function() {
    //add functions to constructor prototypes
    var funcs = th.tpp.viewModelConstructorFunctions;
    Randall.Utility.merge(this.Section.prototype, funcs.Common, funcs.Section);
    Randall.Utility.merge(this.Page.prototype, funcs.Common, funcs.Page);
    Randall.Utility.merge(this.Field.prototype, funcs.Common, funcs.Field);
    Randall.Utility.merge(this.TextInputField.prototype, this.Field.prototype);
    Randall.Utility.merge(this.Option.prototype, funcs.Common, funcs.Option);
  },
  Section: function(options) {
    Randall.Utility.merge(this, options);
    this.dataModel = th.tpp.dataModel;
  },
  Page: function(options) {
    Randall.Utility.merge(this, options);
    this.dataModel = th.tpp.dataModel;
  },
  Field: function(options) {
    var defaults = { type: 'text' };
    Randall.Utility.merge(this, defaults, options);
    this.dataModel = th.tpp.dataModel;
  },
  TextInputField: function(options) {
    var defaults = { type: 'text' };
    Randall.Utility.merge(this, defaults, options);
    this.dataModel = th.tpp.dataModel;
  },
  Option: function(options) {}
};

th.tpp.viewModelConstructorFunctions = {}; //these get "mixed in" to the constructor prototypes
th.tpp.viewModelConstructorFunctions.Common = { //Common functions
  getId: function() { return this.id; }
};
th.tpp.viewModelConstructorFunctions.Section = { //Section functions
  getGuid: function() { return 's' + this.id; },
  getData: function() { return this.dataModel.sections[this.id-1]; },
  getIsCurrent: function() { return (new RegExp('^'+this.getGuid()).test(this.dataModel.currentLocationGuid)); },
  getIsVisited: function() { return this.pages.join({ initialValue: false, functionName: 'getIsVisited', operator: 'or' }); }, //returns true if any related age is visited
  getIsSufficient: function() { return this.pages.join({ initialValue: true, functionName: 'getIsSufficient', operator: 'and' }); }, //returns true if all related pages are sufficient
  getNext: function() { return this.collection.getById(this.id+1); }, //returns the next section, or undefined if it doesn't exist
  getSummaryHtml: function() {
    var isCurrent = this.getIsCurrent();
    var guid = this.getGuid();
    var s = '<div id="' + guid + '" class="section' + (isCurrent ? ' section-isCurrent' : '') + (this.getIsVisited() ? ' section-isVisited' : '') + '">';
    s += '<span id="' + guid + '-title" class="sectionTitle">' + this.title + '</span>';
    s += '<div class="sectionInner' + (isCurrent ? ' sectionInner-isCurrent' : '') + '">';
    s += this.pages.join({ functionName: 'getSummaryHtml' });
    s += '</div></div>';
    return s;
  }
};
th.tpp.viewModelConstructorFunctions.Page = { //Page functions
  getSection: function() { return this.collection.parent; },
  getSectionId: function() { return this.getSection().id; },
  getGuid: function() { return this.getSection().getGuid() + '-p' + this.id; },
  getData: function() {
    var pages = this.getSection().getData().pages;
    if (!pages[this.id-1]) pages[this.id-1] = { id: this.id-1 }; //create dataModel page if doesn't exist
    return pages[this.id-1];
  },
  getIsCurrent: function() { return (new RegExp('^'+this.getGuid()).test(this.dataModel.currentLocationGuid)); },
  getIsVisited: function() { return this.getData().isVisited || false },
  getIsSufficient: function() { return this.fields.join({ initialValue: true, functionName: 'getIsSufficient', operator: 'and' }); }, //returns true if all related fields are sufficient
  getNextPageInSection: function() { return this.collection.getById(this.id+1); }, //returns the next page in the section, or undefined if it doesn't exist
  getDefaultFullTitle: function() { return this.getSection().id + '. ' + this.getSection().title.toUpperCase() + ' - ' + this.title; },
  getSummaryHtml: function() {
    var s = '<div id="' + this.getGuid() + '" class="page' + (this.getIsVisited() ? ' page-isVisited' : '') + '">';
    if (this.prefix) s += '<span class="pageTitlePrefix">' + this.prefix + '</span>';
    s += '<span class="pageTitle ' + (this.getIsCurrent() ? ' page-isCurrent' : '') + (this.getIsSufficient() ? ' page-isSufficient' : '') + '">' + this.title + '</span>';
    s += '</div>';
    return s;
  },
  getMainHtml: function() {
    var s = '';
    s += '<div class="dev">sectionId: ' + this.getSectionId() + '; pageId: ' + this.id + '; guid: ' + this.getGuid() + '</div>';
    if (this.fields) s += this.fields.join({ functionName: 'getHtml' });
    return s;
  },
  visit: function() { //selects this page (changes location and re-renders)
    th.tpp.dataModel.set({ page: this, isVisited: true, currentLocationGuid: this.getGuid() });
    th.tpp.views.renderAll({ viewModel: th.tpp.viewModel, tip: '' });
    window.scrollTo(0, 0);
  }
};
th.tpp.viewModelConstructorFunctions.Field = { //Field functions
  getPage: function() { return this.collection.parent; },
  getPageId: function() { return this.getPage().id; },
  getSection: function() { return this.getPage().getSection(); },
  getSectionId: function() { return this.getSection().id; },
  getGuid: function() { return this.getPage().getGuid() + '-' + this.id; },
  getPageData: function() { return this.getPage().getData(); },
  getData: function() { return this.getPageData()[this.id]; },
  setData: function(value) { this.dataModel.set({ value: value || this.getValue(), field: this }); },
  getIsCompleted: function() { return !!this.getData(); }, //returns true if field has data
  getIsSufficient: function() { return !this.isRequired || this.getIsCompleted(); }, //returns true if not required or is completed, o/w false
  getHtml: function() {
    if (this.type === 'title') this.id = 'title';
    var s = '<div id="' + this.getGuid() + '" class="control-group field ' + this.type + '">';

    if (this.type === 'title') {
      s += '<span>' + (this.text || this.getPage().getDefaultFullTitle()) + '</span>';
    } else if (this.type === 'text') {
      s += '<span>' + this.text + '</span>';
    } else if (this.type === 'image') {
      s += '<img src="' + this.url + '" class="img-rounded"></img>';
    } else if (this.type === 'multiSelect') {
      if (this.displayFunction)
        console.log('WIP - Field.getHtml:', this.getPageData().roles, this.displayFunction, this.displayFunction({ pageData: this.getPageData() }));
      s += '<span class="text multiSelectText">' + this.text + '</span>';
      var selectOptionHtml = (new Randall.Collection({ type: 'Option' })).add(this.selectOptions || []).join({ functionName: 'getHtml' });
      s += '<select multiple="multiple">' + selectOptionHtml + '</select>';
    } else if (this.type === 'checkbox') {
      s += '<label class="checkbox"><input type="checkbox">' + this.text + '</label>';
    } else if (this.type === 'doLater') {
      s += '<button type="button" class="btn">' + this.text + '</button>';
    } else if (this.type === 'button') {
      s += '<button type="button" class="btn">' + this.text + '</button>';
    } else if (this.type === 'nextPage') {
      s += '<button type="button" class="btn btn-primary nextPage">' + this.text + '</button>';
    } else if (this.type === 'textInput') {
      s += '<span class="textInputText' + (this.isRequired ? ' isRequired' : '') + '">' + this.text + '</span>';
      s += '<input value="' + (this.getData() || '') + '"></input><i class="icon-pencil"></i>';
    } else if (this.type === 'countryCode') {
      s += '<span class="countryCodeText">' + this.text + '</span><input value="' + (this.getData() || '') + '"></input><i class="icon-pencil"></i>';
    } else if (this.type === 'phone') {
      s += '<span class="phoneText">' + this.text + '</span><input value="' + (this.getData() || '') + '"></input><i class="icon-pencil"></i>';
    } else if (this.type === 'skype') {
      s += '<span class="skypeText">' + this.text + '</span><input value="' + (this.getData() || '') + '"></input><i class="icon-pencil"></i>';
    } else if (this.type === 'email') {
      s += '<label class="control-label" for="inputIcon">' + this.text + '</label>';
      s += '<div class="controls">';
      s += '  <div class="input-prepend">';
      s += '  <span class="add-on"><i class="icon-envelope"></i></span>';
      s += '  <input class="span2" id="inputIcon" type="text" value="' + (this.getData() || '') + '"></input>';
      s += '  </div>';
      s += '</div>';
    } else {
      s += '<span>Field type "' + this.type + '" not found</span>';
    };
    s += '</div>';
    return s;
  },
  getDomElement: function() { return $('#' + this.getGuid()); },
  getValue: function() {
    var el = this.getDomElement();
    if (Randall.Utility.isInArray(this.type, ['textInput', 'email', 'countryCode', 'phone', 'skype'])) { return el.find('input').val(); };
  },
  mouseover: function() {
    if (this.tip) {
      th.tpp.views.tips.render({ tip: this.tip });
    };
  },
  mouseout: function() {
    th.tpp.views.tips.render({ tip: 'WIP - tip of focussed field or no tip' });
  }
};
th.tpp.viewModelConstructorFunctions.TextInputField = { //WIP - TextInputField functions
  
};
th.tpp.viewModelConstructorFunctions.Option = { //Option functions
  getHtml: function() {
    return '<option>' + this.value + '</option>';
  }
};

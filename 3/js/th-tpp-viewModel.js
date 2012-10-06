var th = th || {};
th.tpp = th.tpp || {};

th.tpp.viewModel = {
    init: function(options) {
        this.dataModel = options.dataModel;
        th.tpp.viewModelConstructors.init();
        Randall.Collection.prototype._itemConstructors = th.tpp.viewModelConstructors;
        Randall.Collection.prototype._afterAddItem = function(item) {
            if (this.type === 'Section') item.pages = new Randall.Collection({ type: 'Page', parent: item }); //a pages collection will be added to any new section
            if (this.type === 'Page') item.fields = new Randall.Collection({ type: 'Field', parent: item }); //a fields collection will be added to any new page
        };
        this.initSections();
        this.setEventHandlers();
        return this;
    },
    setEventHandlers: function() {
        //summarySection
        $("#summarySection").on('click', '.section-isVisited .sectionTitle', function(event) {
            var guid = 's'+parseInt(this.id.substr(1))+'-p1';
            th.tpp.viewModel.getPageByGuid(guid).visit();
        });
        $("#summarySection").on('click', '.page', function(event) {
            th.tpp.viewModel.getPageByGuid(this.id).visit();
        });
        $("#summarySection").on('click', '#resetUser', function(event) {
            th.tpp.dataModel.resetUserData();
            document.location.reload(true);
        });
        //
        //mainSection
        $("#mainSection").on('mouseover', '.field', function(event) {
            window.clearTimeout(th.tpp.mouseover);
            window.clearTimeout(th.tpp.mouseout);
            var id = this.id;
            var f = function() { th.tpp.viewModel.getFieldByGuid(id).mouseover() };
            th.tpp.mouseover = window.setTimeout(f, 500);
        });
        $("#mainSection").on('mouseout', '.field', function(event) {
            window.clearTimeout(th.tpp.mouseover);
            window.clearTimeout(th.tpp.mouseout);
            var id = this.id;
            var f = function() { th.tpp.viewModel.getFieldByGuid(id).mouseout() };
            th.tpp.mouseout = window.setTimeout(f, 500);
        });
        $("#mainSection").on('change', '.field', function(event) {
            th.tpp.viewModel.getFieldByGuid(this.id).setData();
            th.tpp.views.summary.render({ viewModel: th.tpp.viewModel });
        });
        $("#mainSection").on('click', 'button.nextPage', function(event) {
            th.tpp.viewModel.getNextPage().visit();
        });
        //
    },
    initSections: function() {
        this.sections = new Randall.Collection({ type: 'Section' });
        this.sections.getSummaryHtml = function() {
            var s = '<div id="summary">';
            s += '<button id="viewProfile" class="btn btn-primary" type="button">My Profile</button>';
            s += '<button id="resetUser" class="btn btn-danger" type="button">Reset User</button>';
            s += this.join({ functionName: 'getSummaryHtml' });
            s += '</div>';
            return s;
        };
        
        //********************************** section 1 **********************************
        var section = this.sections.add({ title: 'Essentials' });
        
        //page 1.1
        var page = section.pages.add({ title: 'What are you looking for?', parent: section });
        page.fields.add({ type: 'title', text: 'Welcome to Teacherhorizons!' });
        page.fields.add({ type: 'text', id: 'intro1', text: 'As international school educators...' });
        page.fields.add([
            { type: 'image', id: 'teamPhoto', url: 'http://image.guardian.co.uk/sys-images/Film/Pix/pictures/2007/12/14/ateam460.jpg', title: 'Image Title', alt: 'Image alt' }
        ]);
        page.fields.add([
            { type: 'text', id: 'intro2', text: 'To begin your exciting journey...' },
            { type: 'text', id: 'step1', text: '1. ESSENTIALS (lets you search jobs)' },
            { type: 'image', id: 'step1arrow', url: 'http://www.etoncollege.com/Img/arrow-right-over.png' },
            { type: 'text', id: 'step2', text: '2. IMPORTANT INFO (lets recruiters find you)' },
            { type: 'image', id: 'step2arrow', url: 'http://www.etoncollege.com/Img/arrow-right-over.png' },
            { type: 'text', id: 'step3', text: '3. SHINE! (gives you the best chance)' }
        ]);
        page.fields.add([
            { type: 'text', id: 'intro3', text: 'Let\'s get started - the more you complete your profile...' },
            { type: 'text', id: 'lookingFor', text: 'What are you looking for?' },
            { type: 'multiSelect', id: 'roles', text: 'Role(s)',
                selectOptions: [ '', 'Counsellor', 'Curriculum Coordinator', 'Deputy Head Teacher', 'Director of Studies', 'Early Years / Kindergarten Teacher', 'Educational Psychologist', 'English as a Foreign Language Teacher', 'Head of Department', 'Head of Primary/Elementary', 'Head of School', 'Head of Secondary', 'Head of Section', 'Head of Year (pastoral)', 'IB PYP Coordinator', 'IB MYP Coordinator', 'IB DP Coordinator', 'Librarian', 'Other Position', 'Primary / Elementary Teacher', 'Reception/Pre-K Teacher', 'Special Needs Teacher', 'Subject Leader', 'Teaching Assistant' ],
                tip: 'This is a tip for roles'},
            { type: 'multiSelect', id: 'subject', text: 'Subject',
                selectOptions: [],
                displayFunction: function(options) { console.log('WIP - displayFunction', !options.pageData.roles); return !options.pageData.roles; },
                tip: 'This is a tip for subject'}
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'checkbox', id: 'email', text: 'Email me suitable jobs' },
            { type: 'nextPage', id: 'nextPage', text: 'Next!' },
            { type: 'button', id: 'doLater', text: 'Do later', tip: '<span class="emphasise">Do later</span> will take you back to the homepage.' }
        ]);
        
        //page 1.2
        var page = section.pages.add({ title: 'Contact Information' });
        page.fields.add([
            { type: 'title' },
            { type: 'countryCode', id: 'countryCode', text: 'Country Code' },
            { type: 'phone', id: 'phone', text: 'Phone',
                validationFunction: function(options) { console.log('WIP - validationFunction'); return false; } },
            { type: 'skype', id: 'skype', text: 'Skype' },
            { type: 'email', id: 'email', text: 'Email' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!', tip: '<button type="button" class="btn btn-primary">Next!</button> - takes you to the next page' },
            { type: 'doLater', id: 'doLater', text: 'Do later', tip: '<button type="button" class="btn">Do later</button> - takes you to the homepage' }
        ]);

        //page 1.3
        var page = section.pages.add({ title: 'Key Details' });
        page.fields.add([
            { type: 'title' },
            { type: 'email', id: 'email', text: 'Email2' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 1.4
        var page = section.pages.add({ title: 'CV & Photo' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);
        
        // ********************************** section 2 **********************************
        var section = this.sections.add({ title: 'Important Information' });

        //page 2.1
        var page = section.pages.add({ prefix: 'Referees', title: 'Ref 1' });
        page.fields.add([
            { type: 'title' },
            { type: 'multiSelect', id: 'referenceType', text: 'Reference Type' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 2.2
        var page = section.pages.add({ title: 'Ref 2' });
        page.fields.add([
            { type: 'title' },
            { type: 'multiSelect', id: 'referenceType', text: 'Reference Type' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 2.3
        var page = section.pages.add({ title: 'Ref 3' });
        page.fields.add([
            { type: 'title' },
            { type: 'multiSelect', id: 'referenceType', text: 'Reference Type' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 2.4
        var page = section.pages.add({ title: 'My job search' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 2.5
        var page = section.pages.add({ title: 'Joint applications' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 2.6
        var page = section.pages.add({ title: 'My preferences' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 2.7
        var page = section.pages.add({ title: 'Professional experience' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);
        
        // ********************************** section 3 **********************************
        var section = this.sections.add({ title: 'Really Shine!' });

        //page 3.1
        var page = section.pages.add({ title: 'Skills and languages' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'nextPage', id: 'nextPage', text: 'Next!' }
        ]);

        //page 3.2
        var page = section.pages.add({ title: 'Supporting docs and videos' });
        page.fields.add([
            { type: 'title' }
        ]);
        page.fields.add([ { type: 'textInput', id: 'dummy1', text: 'Dummy required field', isRequired: true } ]);
        page.fields.add([ { type: 'textInput', id: 'dummy2', text: 'Dummy required field 2', isRequired: true } ]);
        page.fields.add([
            { type: 'button', id: 'next', text: '...' }
        ]);
    },
    getSectionByGuid: function(options) {
        var guid = options.guid || options;
        var sectionId = parseInt(guid.substr(1));
        return this.sections.getById(sectionId);
    },
    getPageByGuid: function(options) {
        var guid = options.guid || options;
        var a = guid.split('-'), sectionId = parseInt(a[0].substr(1)), pageId = parseInt(a[1].substr(1));
        return this.sections.getById(sectionId).pages.getById(pageId);
    },
    getFieldByGuid: function(options) {
        var guid = options.guid || options;
        var a = guid.split('-'), sectionId = parseInt(a[0].substr(1)), pageId = parseInt(a[1].substr(1)), fieldId = a[2];
        return this.sections.getById(sectionId).pages.getById(pageId).fields.getById(fieldId);
    },
    getCurrentSection: function() { return this.getSectionByGuid(this.dataModel.currentLocationGuid); },
    getCurrentPage: function() { return this.getPageByGuid(this.dataModel.currentLocationGuid); },
    getNextPage: function() { return this.getCurrentPage().getNextPageInSection() || this.getCurrentSection().getNext().pages.data[0]; }
};

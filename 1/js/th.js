var th = { utility: {}, controller: {}, views: {}, models: {} };

//****************************** utility
$.extend(th.utility, {
});
//****************************** /utility

//****************************** controller
$.extend(th.controller, {
	init: function() {
		th.views.init();
        var name = 'Home';
        if (window.location.hash === '#join-us') name = 'Join Us';
        if (window.location.hash === '#teacher-profile') name = 'Initial Log In';
        
		this.event({ name: name });
		th.views.setFloatingBox();
    },
    event: function(options) {
        //reset
        th.views.myAccount.show();
        //

        window.location.href = "#" + (options.link || options.name).toLowerCase().replace(' ', '-');
        th.views.mainSection.html('<h1>' + options.name + '</h1>');
        
        if (options.name === 'Home') {
            th.views.mainSection.html('<span>' + th.models.loremIpsum.longParagraph + '</span>');
            th.views.mainSection.append('<br/><br/><div><a id="home-join-us" href="#join-us-page" class="button-link">Join Us</a></div>');
            $('#home-join-us').on('click', function(event) { th.controller.event({ name: 'Join Us' }) });
        } else if (options.name === 'Search') {
            th.views.setSearch({ searchString: $('#searchInput').val(), container: th.views.mainSection });
        } else if (options.name === 'Join Us') {
            th.views.myAccount.hide();
            th.views.setJoinUs({ container: th.views.mainSection });
        } else if (options.name === 'Log In') {
            th.views.myAccount.hide();
            th.views.setLogin({ container: th.views.mainSection });
            $('#login-join-us').on('click', function(event) { th.controller.event({ name: 'Join Us' }) });
        } else if (options.name === 'Logged In') {
            th.views.myAccount.text('My Account');
            th.views.mainSection.html('<br/><div>You are now logged in.</div><br/><span>' + th.models.loremIpsum.longParagraph + '</span>');
        } else if (options.name === 'Joined Us') {
            //console.log($('#username').length);
            th.models.loggedIn = true;
            th.views.myAccount.text('My Account');
            this.event({ name: 'Teacher Profile' });
            th.views.mainSection.append(th.views.teacherProfileContainer);
            th.views.teacherProfileContainer.show();
			th.views.setSubjects({ subjects: th.models.subjects });
            
			$('#teacherProfileContainer .section').hide();
			$('#teacherProfileContainer .section1').show();
        };
    }
});
//****************************** /controller

//****************************** views
$.extend(th.views, {
    init: function() {
        this.pageHeader.set();
		this.setSelectors();
		this.setEvents();
	},
    setSelectors: function(options) {
        this.myAccount = $('#myAccount');
        this.mainSection = $('#pageSection article');
        this.loginContainer = $('#loginContainer');
        this.joinUsContainer = $('#joinUsContainer');
        this.floatingBox = $('#floatingBox');
        this.floatingBoxText = $('#floatingBoxText');
        this.floatingBoxTipText = $('#floatingBoxTipText');
        this.teacherProfileContainer = $('#teacherProfileContainer');
        this.floatingBoxContainer = $('#floatingBoxContainer');
	},
    setEvents: function(options) {		
        $('#login-join-us').on('click', function(event) { th.controller.event({ name: 'Join Us' }) });

		$('#subjects').on('change', function() { $('#teacherProfileContainer .section2').show(); });
		$('#cvDoLater').on('click', function() { $('#teacherProfileContainer .section3').show(); });
		$('#photoDoLater').on('click', function() { $('#teacherProfileContainer .section4').show(); });
		$('#phone').on('keydown', function() { $('#teacherProfileContainer .section').show(); });
		
        $('#countryCode').on('focusin', function(event) {
			th.views.floatingBoxText.html('This is a helpful tip about the country code field');
			th.views.floatingBoxTipText.html('This is a nice general tip');
			th.views.floatingBoxContainer.show();
		});
        $('#countryCode').on('focusout', function(event) {
			th.views.floatingBoxContainer.hide();
		});
		
        $('#phone').on('focusin', function(event) {
			th.views.floatingBoxText.html('This is a helpful tip about the phone field');
			th.views.floatingBoxTipText.html('Try to learn the local language');
			th.views.floatingBoxContainer.show();
		});
        $('#phone').on('focusout', function(event) {
			th.views.floatingBoxContainer.hide();
		});
		
        $('#nationality').on('focusin', function(event) {
			th.views.floatingBoxText.html('This is a helpful tip about the nationality field</br></br>You\'re doing well! Keep going :)');
			th.views.floatingBoxTipText.html('Eat local food straight away');
			th.views.floatingBoxContainer.show();
		});
        $('#nationality').on('focusout', function(event) {
			th.views.floatingBoxContainer.hide();
		});
    },
    setSearch: function(options) {
        var container = options.container;
        var searchString = options.searchString;
        var a = (searchString === '' ? {} : th.models.loremIpsum.array);
        var numResults = 0;
        for (var i=0, j=a.length; i<j; i++) {
            if (a[i].title.indexOf(searchString) != -1 || a[i].p1.indexOf(searchString) != -1) {
                var titleHtml = a[i].title.replace(searchString, '<span class="searchTerm">' + searchString + '</span>');
                var p1Html = a[i].p1.replace(searchString, '<span class="searchTerm">' + searchString + '</span>');
                $('<div class="searchResult"><h3>' + titleHtml + '</h3><div>' + p1Html + '</div></div>').appendTo(container);
                numResults++;
            };
        };
        container.prepend('<h1>Search results for \'' + searchString + '\' (' + numResults + ' found)</h1>');
    },
    setLogin: function(options) {
        var container = options.container;
        container.empty();
        this.loginContainer.appendTo(container);
        this.login = $('#login');
        this.login.on('click', function(event) { th.controller.event({ name: 'Logged In' }) });
        this.loginContainer.show();
    },
    setJoinUs: function(options) {
        var container = options.container;
        container.empty();
        this.joinUsContainer.appendTo(container);
        this.joinUs = $('#joinUs');
        this.joinUs.on('click', function(event) { th.controller.event({ name: 'Joined Us' }) });
        this.joinUsContainer.show();
    },
    setFloatingBox: function(options) {
        options = options || {};
        var top = this.floatingBox.offset().top - parseFloat(this.floatingBox.css('margin-top').replace(/auto/, 0));
        $(window).scroll(function (event) {
            $('#floatingBox').toggleClass('fixed', $(this).scrollTop() >= top);
        });
    },
	setSubjects: function(options) {
	    var subjectsHtml = '';
		$(options.subjects).each( function(index, item) {
			subjectsHtml += '<option value="' + item + '">' + item + '</option>';
		});
		$('#subjects').html(subjectsHtml);
		$('#subjects').select2();
	}
});

th.views.pageHeader = {
    set: function(options) {
        this.accountMenu = $('#accountMenu');
        this.nav.set($('.pageNav'), th.models.nav);

        //events
        $('.pageNav ul li').hover(this.nav.itemIn, this.nav.itemOut);
        $('#pageLogo').on('click', function(event) { th.controller.event({ name: 'Home' }) });
        $('#myAccount').on('click', function(event) { th.controller.event({ name: 'Log In' }) });
        $('#searchInput')
            .on('focus', function(event) { $(this).val(''); })
            .on('blur', function(event) { $(this).val('Search...'); })
            .on('keyup', function(event) { th.controller.event({ name: 'Search' }) });
    }
};

th.views.pageHeader.nav = {
    itemIn: function() {
        $(this).addClass('active');
        $(this).find('ul').show().animate({opacity: 1}, 400);
    },
    itemOut: function() {
        $(this).find('ul').hide().animate({opacity: 0}, 200);
        $(this).removeClass('active');
    },
    set: function(elem, data) {
        this.setMainElements(elem, data);
        this.setAdditionalElements(elem);
    },
    setMainElements: function(elem, data, level) {
        if (!data) return;
        level = level || 0;
        var cls = (level === 0 ? 'clear' : '');
        var ul = $('<ul>', { 'class': cls }).appendTo(elem);
        for (var i=0, j=data.length; i<j; i++) {
            var li = $('<li></li>').appendTo(ul);
            var a = $('<a href="#">' + data[i].name + '</a>').appendTo(li);
            a.on('click', data[i], function(event) { event.preventDefault(); th.controller.event(event.data); });
            this.setMainElements(li, data[i].nav, level+1);
        };
    },
    setAdditionalElements: function(elem) {
        elem.find('ul li ul li:first-child').prepend('<li class="arrow"></li>');
        elem.find('ul li:first-child').addClass('first');
        elem.find('ul li:last-child').addClass('last');
        elem.find('ul li ul').parent().append('<span class="dropdown"></span>').addClass('drop');
    }
};
//****************************** /views

//****************************** models
$.extend(th.models, {
	loggedIn: false,
    nav: [
        { name: 'Teaching Abroad' },
        { name: 'About', nav: [
            { name: 'Example sub nav' },
            { name: 'Contact' },
            { name: 'FAQ for schools' },
            { name: 'FAQ for teachers' },
            { name: '...' }
        ]},
        { name: 'International School Jobs' },
        { name: 'News' },
        { name: 'Services' },
        { name: 'Networks' }
    ],
    loremIpsum: {
        longParagraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        array: [
            { title: 'Sodales in dolor commodo lobortis', p1: 'Dictum habitasse odio ornare pulvinar rutrum cubilia lacinia, senectus phasellus metus pharetra mollis semper eu, tortor interdum vestibulum diam orci nec' },
            { title: 'Suscipit lobortis vitae at', p1: 'Nam suspendisse tempor lobortis eget diam viverra nibh, habitasse ultrices platea torquent ornare nec, varius elementum malesuada vehicula feugiat class consequat cursus purus aliquet consequat lectus ipsum proin metus dapibus vel, sociosqu mauris augue porttitor vehicula lobortis nec gravida euismod' },
            { title: 'Quam vestibulum pellentesque cras ac', p1: 'Curae placerat eu donec adipiscing nunc consequat hac nulla eleifend vitae facilisis, bibendum sodales himenaeos elit ligula maecenas congue nec nisl mi nulla praesent, donec metus leo sed odio rutrum fames sollicitudin vehicula porttitor' },
            { title: 'Tellus at risus sit consectetur nam', p1: 'Phasellus aenean praesent lobortis nunc imperdiet condimentum aliquet praesent nullam, tempus suscipit torquent ante eros id proin felis sem ut, commodo consequat nisi dui aenean interdum vulputate nam accumsan venenatis sollicitudin faucibus in neque venenatis convallis lorem' },
            { title: 'Ligula augue viverra quis inceptos quam', p1: 'Varius sem diam auctor potenti sit litora quisque fames gravida urna nec, scelerisque donec integer nunc neque pharetra mattis per id nullam feugiat metus mattis laoreet commodo cubilia erat facilisis ut erat cursus posuere scelerisque lectus molestie torquent curae aptent nulla cras fames ornare vehicula' },
            { title: 'Quisque scelerisque etiam aptent', p1: 'Nulla euismod amet vel curae volutpat ultrices nunc himenaeos neque, felis cras orci nunc massa sem odio at pretium, condimentum rhoncus condimentum luctus torquent cubilia faucibus maecenas arcu placerat nisi et volutpat proin curae egestas eleifend aenean convallis sed elit luctus' },
            { title: 'Nibh convallis praesent convallis fames', p1: 'Fames amet facilisis sapien aliquam torquent feugiat est consectetur ut netus' },
            { title: 'A imperdiet sapien platea maecenas himenaeos', p1: 'Platea vulputate himenaeos amet commodo pulvinar himenaeos aenean egestas sagittis elit nisl' },
            { title: 'Velit nisi dapibus aenean conubia magna', p1: 'Phasellus imperdiet ut quisque morbi condimentum duis tristique neque, nibh blandit consequat rhoncus volutpat consequat vel ac, ut vivamus sollicitudin ad potenti massa ad ornare cras curae aenean maecenas condimentum a proin phasellus hac, torquent suscipit nibh donec dictum feugiat quisque euismod, in malesuada per eleifend netus velit mauris etiam' },
            { title: 'Nec donec vitae ligula magna', p1: 'Consequat tempor bibendum egestas nibh posuere egestas justo morbi, feugiat ut nunc vulputate nibh ligula non blandit vel vulputate eget tincidunt phasellus duis, ut ligula malesuada curabitur morbi, quisque cursus hendrerit primis aenean' },
            { title: 'Himenaeos facilisis morbi quisque bibendum vitae', p1: 'Quis placerat faucibus neque maecenas velit, facilisis fames diam ac in aliquam, commodo faucibus adipiscing ante' },
            { title: 'Mollis ut nibh', p1: 'Inceptos lorem class felis lorem rutrum tempus amet, suspendisse tortor habitasse torquent quis euismod justo laoreet, lectus molestie orci aliquam rutrum suspendisse leo vulputate ipsum metus viverra sapien, aliquam varius quam morbi fringilla, praesent iaculis felis hac' },
            { title: 'Euismod scelerisque duis justo curabitur', p1: 'Arcu dapibus fames laoreet sapien inceptos tincidunt a morbi, lacinia euismod quisque leo mollis vitae odio, aenean lorem vulputate ultricies maecenas euismod nisl' },
            { title: 'Nisi vestibulum rhoncus commodo volutpat', p1: 'Maecenas dictum lacinia iaculis risus imperdiet suspendisse dapibus dui, facilisis commodo adipiscing fringilla nostra sollicitudin hac, amet vivamus vel netus dictum litora a fusce enim molestie etiam at turpis nisl sapien auctor, pretium dictumst egestas eleifend feugiat bibendum diam sagittis, aenean quis imperdiet fusce potenti nunc maecenas' },
            { title: 'Ultrices mauris morbi velit', p1: 'Auctor vel quam nec mattis facilisis molestie sit pellentesque leo ipsum orci id vehicula, et ligula vel per senectus aliquam pellentesque justo pharetra gravida ad ultrices massa ut volutpat' },
            { title: 'Nibh accumsan fusce per consectetur hendrerit', p1: 'Lectus commodo nisl inceptos interdum ullamcorper primis varius class sem, enim aptent diam elit condimentum viverra duis diam potenti non dui at consectetur interdum lacus platea suscipit, cursus iaculis tortor hendrerit taciti fringilla ligula dictum nunc, taciti hac id quis inceptos venenatis porttitor sed' },
            { title: 'Risus habitant tincidunt', p1: 'Mauris platea vitae dolor pretium justo feugiat aliquam curae suscipit, augue fringilla nulla mauris inceptos nec ultricies sed proin, lectus feugiat hendrerit aptent conubia sociosqu elementum lacinia' },
            { title: 'Mi ultrices turpis vel dui', p1: 'Duis etiam suscipit proin condimentum enim dapibus aenean maecenas, aptent curabitur sodales ante fermentum mollis' },
            { title: 'Mi hac enim conubia vel', p1: 'Aliquam mauris nunc cras conubia ullamcorper erat mattis fusce ultricies sagittis habitant ultricies, donec enim luctus leo facilisis elit pellentesque condimentum netus ante molestie' },
            { title: 'Molestie vivamus duis scelerisque ornare eros', p1: 'Diam gravida vestibulum vel justo cras sit lorem, quam laoreet quisque egestas a condimentum class curae, mollis fames libero donec purus consectetur' }
        ]
    },
	subjects: [ 'Accounting', 'All', 'Archaeology', 'Architecture', 'Art and Design', 'Biology', 'Business Studies', 'Careers', 'Chemistry', 'Computing', 'Curriculum Manager', 'Design & Technology', 'Drama', 'Early Years', 'Economics', 'English as a Foreign Language', 'English', 'Environmental Systems and Societies (ESS)', 'Food Technology', 'Foreign Languages', 'French', 'Geography', 'German', 'History', 'Humanities', 'Information Technology', 'Italian', 'Law', 'Mathematics', 'Media Studies', 'Music', 'Not applicable', 'Pastoral Manager', 'Physical Education', 'Physics', 'Politics', 'Portuguese', 'Primary teacher', 'Psychology', 'Religious Education', 'Science', 'Senior Manager', 'Social Sciences', 'Spanish', 'Special Educational Needs (SEN)', 'Supply teacher', 'TOK' ]
});
//****************************** /models

$(document).ready(function() {
    th.controller.init();
});
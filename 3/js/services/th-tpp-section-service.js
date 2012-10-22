/*
    services:
        sectionService - returns the section / page structure
*/

angular.module('tpp').
    service('sectionsService', function() {
        /*
            Note: this currently relies on all ids being directly linked to their array position (id = array position + 1) - *** consider refactoring to avoid this link
        */
        
        var sectionsService = {};
        
        var Section = function(options) { //section constructor
            this.id = options.id;
            this.name = options.name;
            this.pages = options.pages;
            for (var i=0; i<this.pages.length; i++) {
                this.pages[i].sectionId = this.id;
            };
        };
        var Page = function(options) { //page constructor
            this.id = options.id;
            this.name = options.name;
        };
        sectionsService.Section = Section;
        sectionsService.Page = Page;
        
        sectionsService.sections = [
            new Section({ id: 1, name: 'Essentials',
                pages: [
                    new Page({ id: 1, name: 'What are you looking for?' }),
                    new Page({ id: 2, name: 'Contact Information' }),
                    new Page({ id: 3, name: 'Key Details' }),
                    new Page({ id: 4, name: 'CV & Photo' })
                ]
            }),
            new Section({ id: 2, name: 'Important Information',
                pages: [
                    new Page({ id: 1, name: 'Ref 1' }),
                    new Page({ id: 2, name: 'Ref 2' }),
                    new Page({ id: 3, name: 'Ref 3' }),
                    new Page({ id: 4, name: 'My job search' }),
                    new Page({ id: 5, name: 'Joint applications' }),
                    new Page({ id: 6, name: 'Joint applications' }),
                    new Page({ id: 7, name: 'Professional experience' })
                ]
            }),
            new Section({ id: 3, name: 'Really Shine!',
                pages: [
                    new Page({ id: 1, name: 'Skills and languages' }),
                    new Page({ id: 2, name: 'Supporting docs and videos' })
                ]
            })
        ];
        
        sectionsService.getSection = function(sectionId) {
            return this.sections[sectionId-1];
        };

        sectionsService.getPage = function(sectionId, pageId) {
            return this.getSection(sectionId).pages[pageId-1];
        };
        
        sectionsService.pageExists = function(sectionId, pageId) {
            return !!this.getPage(sectionId, pageId);
        };
        
        return sectionsService;
    });
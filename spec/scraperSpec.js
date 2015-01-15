describe("Scraper", function () {
    var scraper;

    beforeEach(function () {

        var di = {};

        di.mongoose = require('mongoose');
        di.mongoose .connect('mongodb://publicdata:rOuqBD3yv2XwJFdUHOtn@ds029051.mongolab.com:29051/heroku_app32713545');
        di.WikiPageLink = require("./mocks/WikiPageLink.js").inject(di);

        scraper = require('../modules/scraper').inject(di);


        //di.WikiPageLink = function(){
        //    var findOne = function(query, output){
        //    }
        //
        //    var exec = function(callback){
        //        callback();
        //    }
        //
        //    return {
        //        findOne:findOne,
        //        exec: exec
        //    };
        //};
    });

    it("Should be able to download and save a new article", function () {
        var url = "http://en.wikipedia.org/wiki/Iron";

        scraper.getWikiPageLinks(url, function (wikiPageLink) {
            console.log("expecting stuff", url, wikiPageLink);
            expect(url).toEqual(wikiPageLink.link);
            var shouldContain = 'http://en.wikipedia.org/wiki/Main_Page';
            var shouldNotContain = 'http://en.wikipedia.org/wiki/DummyPage1';
            expect(wikiPageLink.children.length > 0).toBeTruthy();
            expect(wikiPageLink.children.indexOf(shouldContain)).toEqual(622);
            expect(wikiPageLink.children.indexOf(shouldNotContain)).toEqual(-1);
        });
    });
});
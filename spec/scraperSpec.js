describe("Scraper", function () {
    var scraper;

    beforeEach(function () {
        scraper = require('../modules/scraper');

    });

    it("Should be able to download Iron article", function () {
        var url = "http://en.wikipedia.org/wiki/Iron"

        scraper.getWikiPageLinks(url, function (wikiPageLink) {
            expect(wikiPageLink.children.length > 0).toBeTruthy();
            expect(wikiPageLink.children.indexOf('http://en.wikipedia.org/wiki/Main_Page')).toEqual(622);
            expect(wikiPageLink.children.indexOf("http://en.wikipedia.org/wiki/Philosophy")).toBeTruthy();
        });
    });
});
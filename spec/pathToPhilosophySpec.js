describe("PathToPhilosophy", function () {
    var pathToPhilosophy;

    beforeEach(function () {
        var di = {};
        di.maxDepth = 4;
        di.scraper = require("./mocks/scraper.js");
        di.WikiPageLink = require('./mocks/models/WikiPageLink').inject(di);
        di.WikiPath = require('./mocks/models/WikiPath').inject(di);
        pathToPhilosophy = require('../modules/pathToPhilosophy').inject(di);
    });

    it("Should not be able to find a path when no children", function () {
        var url = "http://en.wikipedia.org/wiki/NoChildren"
        pathToPhilosophy.find(url, function (path) {
            expect(path).toEqual(null);
        });
    });

    it("Should be able to find path with 1 hop", function () {
        var url = "http://en.wikipedia.org/wiki/OneHop"
        pathToPhilosophy.find(url, function (path) {
            expect(path.path.length).toEqual(2);
        });
    });

    it("Should be able to find path with 2 hops", function () {
        var url = "http://en.wikipedia.org/wiki/TwoHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.path.length).toEqual(3);
        });
    });

    it("Should be able to find path with 3 hops", function () {
        var url = "http://en.wikipedia.org/wiki/ThreeHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.path.length).toEqual(4);
        });
    });

    it("Should be able to find path with 4 hops", function () {
        var url = "http://en.wikipedia.org/wiki/FourHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.path.length).toEqual(5);
        });
    });

    it("Should not be able to find a path after a maximum of 4 hops", function () {
        var url = "http://en.wikipedia.org/wiki/FiveHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.path).toEqual(null);
        });
    });

    it("Should avoid getting stock in a loop", function () {
        var url = "http://en.wikipedia.org/wiki/Loopy1"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.path).toEqual(null);
        });
    });

});
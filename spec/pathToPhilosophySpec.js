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

    describe("DFS ", function () {

        it("Should not be able to find a path when no children", function () {
            var url = "http://en.wikipedia.org/wiki/NoChildren"
            pathToPhilosophy.findDFS(url, function (path) {
                expect(path).toEqual(null);
            });
        });

        it("Should be able to find path with 1 DFSHop", function () {
            var url = "http://en.wikipedia.org/wiki/OneDFSHop"
            pathToPhilosophy.findDFS(url, function (path) {
                expect(path.path.length).toEqual(2);
            });
        });

        it("Should be able to find path with 2 DFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/TwoDFSHops"
            pathToPhilosophy.findDFS(url, function (path) {
                console.log("path", path);
                expect(path.path.length).toEqual(3);
            });
        });

        it("Should be able to find path with 3 DFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/ThreeDFSHops"
            pathToPhilosophy.findDFS(url, function (path) {
                console.log("path", path);
                expect(path.path.length).toEqual(4);
            });
        });

        it("Should be able to find path with 4 DFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/FourDFSHops"
            pathToPhilosophy.findDFS(url, function (path) {
                console.log("path", path);
                expect(path.path.length).toEqual(5);
            });
        });

        it("Should not be able to findDFS a path after a maximum of 4 DFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/FiveDFSHops"
            pathToPhilosophy.findDFS(url, function (path) {
                console.log("path", path);
                expect(path.path).toEqual(null);
            });
        });

        it("Should avoid getting stock in a loop", function () {
            var url = "http://en.wikipedia.org/wiki/DFSLoopy1"
            pathToPhilosophy.findDFS(url, function (path) {
                console.log("path", path);
                expect(path.path).toEqual(null);
            });
        });
    });


    describe("BFS ", function () {

        it("Should not be able to find a path when no children", function () {
            var url = "http://en.wikipedia.org/wiki/NoChildren"
            pathToPhilosophy.findBFS(url, function (path) {
                expect(path).toEqual(null);
            });
        });

        it("Should be able to find path with 1 BFSHop", function () {
            var url = "http://en.wikipedia.org/wiki/OneBFSHop"
            pathToPhilosophy.findBFS(url, function (path) {
                console.log('pathInFirstBFS', path);

                expect(path.path.length).toEqual(2);
                expect(path.path).toEqual(
                    [ 'http://en.wikipedia.org/wiki/OneBFSHop',
                      'http://en.wikipedia.org/wiki/Philosophy' ]
                );
            });
        });

        it("Should be able to find path with 2 BFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/TwoBFSHops"
            pathToPhilosophy.findBFS(url, function (path) {
                console.log("path", path);
                expect(path.path.length).toEqual(3);

                expect(path.path).toEqual(
                    [ 'http://en.wikipedia.org/wiki/OneBFSHop',
                        'http://en.wikipedia.org/wiki/TwoBFSHops',
                        'http://en.wikipedia.org/wiki/Philosophy' ]
                );
            });
        });

        it("Should be able to find path with 3 BFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/ThreeBFSHops"
            pathToPhilosophy.findBFS(url, function (path) {
                console.log("path", path);
                expect(path.path.length).toEqual(4);
                expect(path.path).toEqual(
                    [ 'http://en.wikipedia.org/wiki/OneBFSHop',
                        'http://en.wikipedia.org/wiki/TwoBFSHops',
                        'http://en.wikipedia.org/wiki/ThreeBFSHops',
                        'http://en.wikipedia.org/wiki/Philosophy' ]
                );
            });
        });

        it("Should be able to find path with 4 BFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/FourBFSHops"
            pathToPhilosophy.findBFS(url, function (path) {
                console.log("path", path);
                expect(path.path.length).toEqual(5);
                expect(path.path).toEqual(
                    [ 'http://en.wikipedia.org/wiki/OneBFSHops',
                        'http://en.wikipedia.org/wiki/TwoBFSHops',
                        'http://en.wikipedia.org/wiki/ThreeBFSHops',
                        'http://en.wikipedia.org/wiki/FourBFSHops',
                        'http://en.wikipedia.org/wiki/Philosophy' ]
                );
            });
        });

        it("Should not be able to findBFS a path after a maximum of 4 BFSHops", function () {
            var url = "http://en.wikipedia.org/wiki/FiveBFSHops"
            pathToPhilosophy.findBFS(url, function (path) {
                console.log("path", path);
                expect(path.path).toEqual(null);
            });
        });


    });
});
describe("PathToPhilosophy", function () {
    var pathToPhilosophy;

    beforeEach(function () {
        var di = {};
        di.maxDepth = 4;
        di.scraper = {};
        di.scraper.getWikiPageLinks = function (url, callback) {

            var data = {
                link: "http://en.wikipedia.org/wiki/NoChildren",
                children: []
            };

            if (url == "http://en.wikipedia.org/wiki/OneHop") {
                data = {
                    link: "http://en.wikipedia.org/wiki/OneHop",
                    children: [
                        "http://en.wikipedia.org/wiki/DummyPage1",
                        "http://en.wikipedia.org/wiki/DummyPage2",
                        "http://en.wikipedia.org/wiki/Philosophy"
                    ]
                };
            }

            if (url == "http://en.wikipedia.org/wiki/TwoHops") {
                data = {
                    link: "http://en.wikipedia.org/wiki/TwoHops",
                    children: [
                        "http://en.wikipedia.org/wiki/DummyPage1",
                        "http://en.wikipedia.org/wiki/DummyPage1",
                        "http://en.wikipedia.org/wiki/OneHop"
                    ]
                };
            }

            if (url == "http://en.wikipedia.org/wiki/ThreeHops") {
                data = {
                    link: "http://en.wikipedia.org/wiki/ThreeHops",
                    children: [
                        "http://en.wikipedia.org/wiki/DummyPage1",
                        "http://en.wikipedia.org/wiki/TwoHops",
                        "http://en.wikipedia.org/wiki/DummyPage1"
                    ]
                };
            }

            if (url == "http://en.wikipedia.org/wiki/FourHops") {
                data = {
                    link: "http://en.wikipedia.org/wiki/FourHops",
                    children: [
                        "http://en.wikipedia.org/wiki/ThreeHops",
                        "http://en.wikipedia.org/wiki/DummyPage1",
                        "http://en.wikipedia.org/wiki/DummyPage1"
                    ]
                };
            }

            if (url == "http://en.wikipedia.org/wiki/FiveHops") {
                data = {
                    link: "http://en.wikipedia.org/wiki/FiveHops",
                    children: [
                        "http://en.wikipedia.org/wiki/FourHops",
                        "http://en.wikipedia.org/wiki/DummyPage1",
                        "http://en.wikipedia.org/wiki/FourHops"
                    ]
                };
            }

            if (url == "http://en.wikipedia.org/wiki/Loopy1") {
                data = {
                    link: "http://en.wikipedia.org/wiki/Loopy1",
                    children: [
                        "http://en.wikipedia.org/wiki/Loopy2"
                    ]
                };
            }

            if (url == "http://en.wikipedia.org/wiki/Loopy1") {
                data = {
                    link: "http://en.wikipedia.org/wiki/Loopy2",
                    children: [
                        "http://en.wikipedia.org/wiki/Loopy1"
                    ]
                };
            }
            callback(data)

        }
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
            expect(path.length).toEqual(1);
        });
    });

    it("Should be able to find path with 2 hops", function () {
        var url = "http://en.wikipedia.org/wiki/TwoHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.length).toEqual(2);
        });
    });

    it("Should be able to find path with 3 hops", function () {
        var url = "http://en.wikipedia.org/wiki/ThreeHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.length).toEqual(3);
        });
    });

    it("Should be able to find path with 4 hops", function () {
        var url = "http://en.wikipedia.org/wiki/FourHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path.length).toEqual(4);
        });
    });

    it("Should not be able to find a path after a maximum of 4 levels", function () {
        var url = "http://en.wikipedia.org/wiki/FiveHops"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path).toEqual(null);
        });
    });

    it("Should avoid getting stock in a loop", function () {
        var url = "http://en.wikipedia.org/wiki/Loopy1"
        pathToPhilosophy.find(url, function (path) {
            console.log("path", path);
            expect(path).toEqual(null);
        });
    });

});
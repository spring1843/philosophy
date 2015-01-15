module.exports.getWikiPageLinks = function (url, callback) {

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
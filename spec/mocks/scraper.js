module.exports.getWikiPageLinks = function (url, callback) {

    var data = {
        link: "http://en.wikipedia.org/wiki/NoChildren",
        children: []
    };

    if (url == "http://en.wikipedia.org/wiki/OneDFSHop") {
        data = {
            link: "http://en.wikipedia.org/wiki/OneDFSHop",
            children: [
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage2",
                "http://en.wikipedia.org/wiki/Philosophy"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/TwoDFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/TwoDFSHops",
            children: [
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/OneDFSHop"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/ThreeDFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/ThreeDFSHops",
            children: [
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/TwoDFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/FourDFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/FourDFSHops",
            children: [
                "http://en.wikipedia.org/wiki/ThreeDFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage1"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/FiveDFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/FiveDFSHops",
            children: [
                "http://en.wikipedia.org/wiki/FourDFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/FourDFSHops"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/DFSLoopy1") {
        data = {
            link: "http://en.wikipedia.org/wiki/DFSLoopy1",
            children: [
                "http://en.wikipedia.org/wiki/DFSLoopy2"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/DFSLoopy2") {
        data = {
            link: "http://en.wikipedia.org/wiki/DFSLoopy2",
            children: [
                "http://en.wikipedia.org/wiki/DFSLoopy1"
            ]
        };
    }



    if (url == "http://en.wikipedia.org/wiki/OneBFSHop") {
        data = {
            link: "http://en.wikipedia.org/wiki/OneBFSHop",
            children: [
                "http://en.wikipedia.org/wiki/Philosophy",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage2"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/TwoBFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/TwoBFSHops",
            children: [
                "http://en.wikipedia.org/wiki/OneBFSHop",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage2"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/ThreeBFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/ThreeBFSHops",
            children: [
                "http://en.wikipedia.org/wiki/TwoBFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage2"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/FourBFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/FourBFSHops",
            children: [
                "http://en.wikipedia.org/wiki/ThreeBFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage1"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/FiveBFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/FiveBFSHops",
            children: [
                "http://en.wikipedia.org/wiki/FourBFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage1"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/FiveBFSHops") {
        data = {
            link: "http://en.wikipedia.org/wiki/FiveBFSHops",
            children: [
                "http://en.wikipedia.org/wiki/FourBFSHops",
                "http://en.wikipedia.org/wiki/DummyPage1",
                "http://en.wikipedia.org/wiki/DummyPage1"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/BFSLoopy1") {
        data = {
            link: "http://en.wikipedia.org/wiki/BFSLoopy1",
            children: [
                "http://en.wikipedia.org/wiki/BFSLoopy2"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/BFSLoopy2") {
        data = {
            link: "http://en.wikipedia.org/wiki/BFSLoopy2",
            children: [
                "http://en.wikipedia.org/wiki/BFSLoopy3"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/BFSLoopy3") {
        data = {
            link: "http://en.wikipedia.org/wiki/BFSLoopy3",
            children: [
                "http://en.wikipedia.org/wiki/BFSLoopy4"
            ]
        };
    }

    if (url == "http://en.wikipedia.org/wiki/BFSLoopy3") {
        data = {
            link: "http://en.wikipedia.org/wiki/BFSLoopy3",
            children: [
                "http://en.wikipedia.org/wiki/BFSLoopy2"
            ]
        };
    }








    callback(data)
}
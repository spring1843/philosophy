PathToPhilosophy = function (di) {

    var dep = di;
    var scraper = dep.scraper || require('./scraper');
    var destinationUrl = dep.destination || 'http://en.wikipedia.org/wiki/Philosophy';
    var path = [];
    var visits = [];
    var root = null;
    var scrapes = 0;
    var maxDepth = dep.maxDepth || 6;
    var maxNumberOfVisits = null;

    var find = function (url, callback) {
        console.log('Scraping', url);
        recursiveFind(url, callback);
    }

    var recursiveFind = function (url, callback) {


        checkForMaxVisits(callback);
        scraper.getWikiPageLinks(url, function (wikiPageLink) {

            handleRoot(wikiPageLink, callback);

            if (hasChildren(wikiPageLink) === false) {
                return false;
            }

            if (checkForSuccess(wikiPageLink, callback) === true)
                return true;
            depthFirstSearch(wikiPageLink, callback);
        });
    }

    var hasChildren = function (wikiPageLink) {
        if (wikiPageLink.children && wikiPageLink.children.length > 0)
            return true;
        return false;
    }


    var handleRoot = function (wikiPageLink, callback) {
        if (path.length === 0) {
            path.push(wikiPageLink.link);
            root = wikiPageLink;
            if (hasChildren(root) === true) {
                maxNumberOfVisits = root.children.length * maxDepth;
            } else {
                callback(null);
            }
        }
    }

    var checkForSuccess = function (wikiPageLink, callback) {
        console.log('is linked to Philosophy?', isLinkedToPhilosophy(wikiPageLink));
        if (isLinkedToPhilosophy(wikiPageLink)) {
            callback(path);
            console.log("FOUND PATH!", path);
            return true;
        }
        return false;
    }

    var isLinkedToPhilosophy = function (wikiPageLink) {
        if (wikiPageLink.children.indexOf(destinationUrl) != -1)
            return true;
        else
            return false;
    }

    var checkForMaxVisits = function (callback) {
        if (++scrapes == maxNumberOfVisits)
            callback(null);
    }
    var checkForMxaxDepth = function () {
        if (path.length < maxDepth)
            return true;
        return false;
    }

    var depthFirstSearch = function (wikiPageLink, callback) {
        for (var i in wikiPageLink.children) {
            if (checkForMxaxDepth()) {
                var child = wikiPageLink.children[i];
                visitChild(child, callback);
            }
        }
    }

    var hasVisitedChild = function (childLink) {
        if (visits.indexOf(childLink) === -1)
            return false
        return true;
    }
    var visitChild = function (childLink, callback) {
        if (hasVisitedChild(childLink) === true)
            return;

        path.push(childLink);
        visits.push(childLink);
        recursiveFind(childLink, callback);
        path.pop();
    }

    return {
        find: find
    };
};
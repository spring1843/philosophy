module.exports.inject = function (di) {

    var dep = di;
    var scraper = dep.scraper || require('./scraper').inject(di);
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
        scraper.getWikiPageLinks(url, function (wikiPageLink) {
            handleRoot(wikiPageLink, callback);

            if (hasChildren(wikiPageLink) === false)
                return false;

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
            visits.push(root.link);
            if (hasChildren(root) === true) {
                maxNumberOfVisits = root.children.length * maxDepth;
                console.log("maxNumberOfVisits set to", maxNumberOfVisits);
            } else {
                callback(null);
            }
        }
    }

    var checkForSuccess = function (wikiPageLink, callback) {
        console.log('is linked to Philosophy?',wikiPageLink.link, isLinkedToPhilosophy(wikiPageLink));
        if (isLinkedToPhilosophy(wikiPageLink)) {
            finalizeSuccess(wikiPageLink, callback);
            return true;
        }
        return false;
    }

    var finalizeSuccess = function(wikiPageLink, callback){
        console.log("Finalizing",visits, path)
        callback(path);
    }

    var isLinkedToPhilosophy = function (wikiPageLink) {
        if (wikiPageLink.children.indexOf(destinationUrl) != -1)
            return true;
        else
            return false;
    }

    var checkForMxaxDepth = function () {
        if (path.length < maxDepth)
            return true;
        return false;
    }

    var depthFirstSearch = function (wikiPageLink, callback) {
        wikiPageLink.children.forEach(function(childLink){
            if (checkForMxaxDepth() == false)
                return;
            visitChild(childLink, callback);
        });
    }

    var hasVisitedChild = function (childLink) {
        if (visits.indexOf(childLink) === -1)
            return false
        return true;
    }

    var visitChild = function (childLink, callback) {
        if (hasVisitedChild(childLink) === true || visits.length >= maxNumberOfVisits)
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
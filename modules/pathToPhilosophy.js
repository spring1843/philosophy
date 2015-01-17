module.exports.inject = function (di) {

    var dep = di;
    var scraper = dep.scraper || require('./scraper').inject(di);
    var destinationUrl = dep.destination || 'http://en.wikipedia.org/wiki/Philosophy';
    var WikiPageLink = dep.WikiPageLink || require('../models/WikiPageLink').inject(dep);

    var visits = [];
    var scrapes = [];
    var root = null;
    var isResultsSentBack = false;

    var maxDepth = dep.maxDepth || 6;
    var hardMaxNumberOfVisits = dep.hardMaxNumberOfVisits || 200;
    var maxNumberOfVisits = null;

    var find = function (url, callback) {
        console.log('Scraping', url);
        init();
        var newRoot = {link: url, parent: null};
        recursiveFind(newRoot, callback);
    }

    var init = function () {
        visits = [];
        scrapes = [];
        root = null;
        isResultsSentBack = false;
    }

    var recursiveFind = function (wikiPageLink, callback) {
        scraper.getWikiPageLinks(wikiPageLink.link, function (wikiPageLink) {
            scrapes.push(wikiPageLink.link);
            handleRoot(wikiPageLink, callback);

            if (hasChildren(wikiPageLink) === false)
                return false;

            if (checkResults(wikiPageLink, callback) === true)
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
        if (root === null) {
            root = wikiPageLink;
            visits.push({link: wikiPageLink.link, parent: null});
            if (hasChildren(root) === true) {
                setMaxNumberOfVisits(root);
                console.log("maxNumberOfVisits set to", maxNumberOfVisits);
            } else {
                callback(null);
            }
        }
    }

    var setMaxNumberOfVisits = function (root) {
        var maxNumberOfVisitsGivenDepth = root.children.length * maxDepth;
        if (maxNumberOfVisitsGivenDepth > hardMaxNumberOfVisits)
            maxNumberOfVisits = hardMaxNumberOfVisits
        else
            maxNumberOfVisits = maxNumberOfVisitsGivenDepth;
    }

    var checkResults = function (wikiPageLink, callback) {
        var isSuccessful = checkForSuccess(wikiPageLink, callback);
        var isFailed = checkForFailure(callback);

        if (isFailed === true || isSuccessful === true)
            return true;
        else
            return false;
    }

    var checkForFailure = function (callback) {
        if (isResultsSentBack === false && scrapes.length >= maxNumberOfVisits) {
            finalizeFailure(callback);
            return true;
        }
        return false;
    }

    var checkForSuccess = function (wikiPageLink, callback) {
        var isSuccessFull = isLinkedToPhilosophy(wikiPageLink);
        console.log('is linked to Philosophy?', isSuccessFull, wikiPageLink.link);
        if (isSuccessFull === true) {
            if (isResultsSentBack === false) {
                finalizeSuccess(wikiPageLink, callback);
            }
            saveSuccessForPath(wikiPageLink);
            return true;
        }
        return false;
    }

    function saveSuccessForLink(path, linkInPath) {
        console.log('saving success for link', linkInPath);
        WikiPageLink.findOne({link: linkInPath, path: []}, function (err, wikiPageLink) {
            if (err || wikiPageLink == null)
                return;
            wikiPageLink.path = findSubPathInPath(path, wikiPageLink.link);
            wikiPageLink.save();
        });
    }

    var saveSuccessForPath = function (wikiPageLink) {
        var path = findPath(wikiPageLink.link);
        console.log('saving success for path', path);
        path.forEach(function (linkInPath) {
            if (linkInPath === destinationUrl)
                return;
            saveSuccessForLink(path, linkInPath);
        });
    }

    var findSubPathInPath = function (path, link) {
        var linkIndex = path.indexOf(link);
        return path.slice(linkIndex, path.length - 1);
    }

    var findParent = function (wikiPageLink) {
        var parent = null;
        visits.some(function (visit) {
            if (visit.link == wikiPageLink) {
                parent = visit.parent;
                return true;
            }
        });
        return parent;
    }

    var findPath = function (link) {
        var path = [];
        path.push(destinationUrl);
        path.push(link);
        var parent = findParent(link);
        while (parent != null) {
            path.push(parent);
            parent = findParent(parent);
        }
        return path.reverse();
    }

    var finalizeSuccess = function (wikiPageLink, callback) {
        if (isResultsSentBack === false) {
            var path = findPath(wikiPageLink.link);
            callback({path: path, crawls: visits.length, hops: path.length - 2});
            console.log('Success sent back');
        }

        isResultsSentBack = true;
    }

    var finalizeFailure = function (callback) {
        if (isResultsSentBack === false) {
            callback({path: null, crawls: visits.length, hops: null});
            console.log('Failure sent back');
        }

        isResultsSentBack = true;
    }

    var isLinkedToPhilosophy = function (wikiPageLink) {
        if (wikiPageLink.children.indexOf(destinationUrl) != -1)
            return true;
        else
            return false;
    }

    var depthFirstSearch = function (wikiPageLink, callback) {
        wikiPageLink.children.forEach(function (childLink) {
            visitChild(wikiPageLink.link, childLink, callback);
        });
    }

    var hasVisitedChild = function (childLink) {
        if (visits.indexOf(childLink) === -1)
            return false
        return true;
    }

    var visitChild = function (parent, childLink, callback) {

        if (hasVisitedChild(childLink) === true) {
            return;
        }

        if (visits.length >= maxNumberOfVisits) {
            return;
        }

        var child = {link: childLink, parent: parent};
        visits.push(child);
        recursiveFind(child, callback);
    }

    return {
        find: find
    };
};
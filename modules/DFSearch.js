module.exports.inject = function (di) {

    var dep = di;
    var scraper = dep.scraper || require('./scraper').inject(di);
    var destinationUrl = dep.destination || 'http://en.wikipedia.org/wiki/Philosophy';
    var WikiPageLink = dep.WikiPageLink || require('../models/WikiPageLink').inject(dep);
    var WikiPath = dep.WikiPath || require('../models/WikiPath').inject(dep);

    var visits = [];
    var scrapes = [];
    var root = null;
    var isResultsSentBack = false;

    var maxDepth = dep.maxDepth || 6;
    var hardMaxNumberOfVisits = dep.hardMaxNumberOfVisits || 300;
    var maxNumberOfVisits = null;

    var init = function () {
        visits = [];
        scrapes = [];
        root = null;
        isResultsSentBack = false;
    }

    var find = function (url, callback) {
        init();
        var newRoot = {link: url, parent: null};
        recursiveFind(newRoot, callback);
    }

    var recursiveFind = function (wikiPageLink, callback) {
        scraper.getWikiPageLinks(wikiPageLink.link, function (wikiPageLink) {

            if (checkWikiPageValidity(wikiPageLink) === false)
                return false;

            scrapes.push(wikiPageLink.link);
            handleRoot(wikiPageLink, callback);

            if (hasChildren(wikiPageLink) === false)
                return false;

            if (checkResults(wikiPageLink, callback) === true)
                return true;

            depthFirstSearch(wikiPageLink, callback);
        });
    }

    var checkWikiPageValidity = function(wikiPageLink){
        if(wikiPageLink === null)
            return false;
        else
            return true;
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
        if (checkForDirectLink(wikiPageLink, callback) === true)
            return true;

        if (checkForExistenceInPaths(wikiPageLink, callback) === true)
            return true;

        return false;
    }

    var checkForDirectLink = function (wikiPageLink, callback) {
        var isSuccessFull = isLinkedToPhilosophy(wikiPageLink);
        console.log('Is linked to Philosophy?', isSuccessFull, wikiPageLink.link);
        if (isSuccessFull === true) {
            if (isResultsSentBack === false) {
                finalizeSuccess(wikiPageLink, null, callback);
            }
            saveSuccessForPath(wikiPageLink);
            return true;
        }
        return false;
    }

    var checkForExistenceInPaths = function (wikiPageLink, callback) {
        console.log("Does link exist in a successful path?", wikiPageLink.link);
        WikiPath.findOne({path: wikiPageLink.link}, function (err, wikiPageLinkWithPath) {
            if (err || wikiPageLinkWithPath == null || wikiPageLinkWithPath == undefined)
                return;

            var subPath = findSubPathInPath(wikiPageLinkWithPath.path, wikiPageLink.link);

            if (isResultsSentBack === false)
                finalizeSuccess(wikiPageLink, subPath, callback);
            console.log('Link', wikiPageLink.link, 'exists in path of', wikiPageLinkWithPath.link);
        });
    }

    var saveSuccessForPath = function (wikiPageLink) {
        var path = findPath(wikiPageLink.link);

        console.log('Saving path', path, "if no path in DB containing", path[0], 'is found');
        WikiPath.where({path: path[0]}).count(function (err, count) {
            console.log('Did path already exist?', count);
            if (count > 0)
                return

            var wikiPath = new WikiPath({path: path});
            wikiPath.save(function (error) {
                if (error)
                    console.log("Error creating new WikiPath");

                console.log("Created WikiPath in DB for", path);
            });
        });
    }

    var findSubPathInPath = function (path, link) {
        var linkIndex = path.indexOf(link);
        if (linkIndex == 0)
            return path.slice(linkIndex, path.length);
        else
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

    var finalizeSuccess = function (wikiPageLink, path, callback) {
        if (isResultsSentBack === false) {
            if (path === null)
                path = findPath(wikiPageLink.link);

            var results = {path: path, crawls: scrapes.length, hops: path.length - 2};
            console.log('Success sent back with results', results);
            callback(results);
        }

        isResultsSentBack = true;
    }

    var finalizeFailure = function (callback) {
        if (isResultsSentBack === false) {
            var results = {path: null, crawls: visits.length, hops: null};
            console.log('Failure sent back with results', results);
            callback(results);
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
            if (checkForMaxDepth(wikiPageLink.link) === true)
                visitChild(wikiPageLink.link, childLink, callback);
        });
    }

    var checkForMaxDepth = function (link) {
        var path = findPath(link);
        if (path.length < maxDepth)
            return true;
        return false;
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
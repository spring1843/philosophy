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
    var maxDepth = dep.maxDepth || 300;

    var init = function () {
        visits = [];
        scrapes = [];
        root = null;
        isResultsSentBack = false;
    }

    var find = function (url, callback) {
        console.log('Scraping', url);
        init();
        var newRoot = {link: url, parent: null};
        recursiveFind(newRoot, callback);
    }

    var recursiveFind = function (wikiPageLink, callback) {
        scraper.getWikiPageFirstLink(wikiPageLink.link, function (wikiPageLink) {

            if (checkWikiPageValidity(wikiPageLink) === false)
                return false;

            scrapes.push(wikiPageLink.link);
            handleRoot(wikiPageLink, callback);

            if (hasChildren(wikiPageLink) === false)
                return false;

            if (checkForSuccess(wikiPageLink, callback) === true)
                return true;

            breadthFirstSearch(wikiPageLink, callback);
        });
    }

    var checkWikiPageValidity = function (wikiPageLink) {
        if (wikiPageLink === null)
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
            if (hasChildren(root) === false) {
                callback(null);
                console.log('root has no children', root);
            }
        }
    }


    var checkForSuccess = function (wikiPageLink, callback) {
        var isSuccessFull = isPhilosophy(wikiPageLink);
        console.log('Is Philosophy?', isSuccessFull, wikiPageLink.link);
        if (isSuccessFull === true) {
            if (isResultsSentBack === false) {
                finalizeSuccess(wikiPageLink, null, callback);
            }
            saveSuccessForPath(wikiPageLink);
            return true;
        }
        return false;
    }


    var saveSuccessForPath = function (wikiPageLink) {
        var path = getPath();

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

    var getPath = function () {
        var path = [];
        for (i in visits) {
            path.push(visits[i].link);
        }
        return path;
    }

    var finalizeSuccess = function (wikiPageLink, path, callback) {
        if (isResultsSentBack === false) {
            var path = getPath();
            var results = {path: path, crawls: scrapes.length, hops: path.length - 2};
            console.log('Success sent back with results', results);
            callback(results);
        }

        isResultsSentBack = true;
    }

    var finalizeFailure = function (message, callback) {
        if (isResultsSentBack === false) {
            var results = {path: null, crawls: visits.length, hops: null, message: message};
            console.log('Failure sent back with results', results);
            callback(results);
        }

        isResultsSentBack = true;
    }

    var isPhilosophy = function (wikiPageLink) {
        if (wikiPageLink.link === destinationUrl)
            return true;
        else
            return false;
    }

    var breadthFirstSearch = function (wikiPageLink, callback) {
        if (checkForMaxDepth(wikiPageLink.link) === true) {
            console.log('visiting child', wikiPageLink.children[0]);
            visitChild(wikiPageLink.link, wikiPageLink.children[0], callback);
        } else {
            finalizeFailure('max depth reached', callback);
        }
    }

    var checkForMaxDepth = function () {
        if (visits.length < maxDepth)
            return true;
        return false;
    }

    var hasVisitedChild = function (childLink) {
        for (var i in visits) {
            var visit = visits[i];
            if (visit.link == childLink)
                return true;
        }
        return false;
    }

    var visitChild = function (parent, childLink, callback) {

        if (hasVisitedChild(childLink) === true) {
            console.log(childLink, 'has been visited before potential loop in path', getPath());
            finalizeFailure('ERR.LOOP', callback);
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
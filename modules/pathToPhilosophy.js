module.exports.inject = function (di) {

    var dep = di;
    var scraper = dep.scraper || require('./scraper').inject(di);
    var destinationUrl = dep.destination || 'http://en.wikipedia.org/wiki/Philosophy';
    var WikiPageLink = dep.WikiPageLink || require('../models/WikiPageLink').inject(dep);

    var visits = [];
    var root = null;
    var isPathFoundAlready = false;

    var maxDepth = dep.maxDepth || 6;
    var maxNumberOfVisits = null;

    var find = function (url, callback) {
        console.log('Scraping', url);
        init();
        var newRoot = {link: url, parent: null};
        recursiveFind(newRoot, callback);
    }

    var init = function(){
        visits = [];
        root = null;
        isPathFoundAlready = false;
    }

    var recursiveFind = function (wikiPageLink, callback) {
        scraper.getWikiPageLinks(wikiPageLink.link, function (wikiPageLink) {
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
        if (root === null) {
            root = wikiPageLink;
            visits.push({link: wikiPageLink.link, parent: null});
            if (hasChildren(root) === true) {
                maxNumberOfVisits = root.children.length * maxDepth;
                console.log("maxNumberOfVisits set to", maxNumberOfVisits);
            } else {
                callback(null);
            }
        }
    }

    var checkForSuccess = function (wikiPageLink, callback) {
        var isSuccessFull = isLinkedToPhilosophy(wikiPageLink);
        console.log('is linked to Philosophy?',isSuccessFull,wikiPageLink.link);
        if (isSuccessFull === true) {

            if(isPathFoundAlready === false) {
                finalizeSuccess(wikiPageLink, callback);
            }
            saveSuccess(wikiPageLink);
            return true;
        }
        return false;
    }

    var saveSuccess = function(wikiPageLink){
        var path = findPathFromLinkToDestination(wikiPageLink.link);
        return;
        WikiPageLink.findOne({link: wikiPageLink.link}, function (err, doc){
            doc.path = path;
            doc.save();
        });
    }
    var findPathFromLinkToDestination = function(link){
        var path = findPath(link);
        var linkPosition = path.indexOf(link);
        var linkDistanceFromEndOfPath = path.length - linkPosition -1;
        console.log('path', path)
        pathFromLinkToDestination = path.splice(linkPosition, linkDistanceFromEndOfPath);
        console.log('link',link, 'linkposition', linkPosition, 'linkDistance', linkDistanceFromEndOfPath, 'path to destination', pathFromLinkToDestination);
        return pathFromLinkToDestination.reverse();
    }

    var findParent = function(wikiPageLink){
        var parent = null;
        visits.some(function(visit){
            if(visit.link == wikiPageLink) {
                    parent = visit.parent;
                    return true;
            }
        });
        return parent;
    }

    var findPath = function(link){
        var path = [];
        path.push(destinationUrl);
        path.push(link);
        var parent = findParent(link);
        while(parent != null){
            path.push(parent);
            parent = findParent(parent);
        }
        return path.reverse();
    }

    var finalizeSuccess = function(wikiPageLink, callback){
        isPathFoundAlready = true;

        var path = findPath(wikiPageLink.link);
        callback({path:path, hops:path.length});
    }

    var isLinkedToPhilosophy = function (wikiPageLink) {
        if (wikiPageLink.children.indexOf(destinationUrl) != -1)
            return true;
        else
            return false;
    }

    var depthFirstSearch = function (wikiPageLink, callback) {
        wikiPageLink.children.forEach(function(childLink){
            visitChild(wikiPageLink.link, childLink, callback);
        });
    }

    var hasVisitedChild = function (childLink) {
        if (visits.indexOf(childLink) === -1)
            return false
        return true;
    }

    var visitChild = function (parent, childLink, callback) {
        if (hasVisitedChild(childLink) === true || visits.length >= maxNumberOfVisits)
            return;

        var child = {link: childLink, parent: parent};
        visits.push(child);
        recursiveFind(child, callback);
    }

    return {
        find: find
    };
};
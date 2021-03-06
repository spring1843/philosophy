module.exports.inject = function (di) {

    var dep = di;
    var linkscrape = dep.linkscrape || require('linkscrape');
    var cheerio = dep.cheerio || require('cheerio');
    var request = dep.request || require('request');
    var linkSanitizer = dep.linkSanitizer || require('./linkSanitizer.js').inject(dep);
    var WikiPageLink = dep.WikiPageLink || require('../models/WikiPageLink').inject(dep);

    var getWikiPageLinks = function (url, callback) {
        console.log("Searching DB for ", url);
        WikiPageLink.findOne({link: url}, {link: 1, children: 1, path: 1, _id: 0}).exec(function (error, wikiPageLink) {
            if (error)
                console.log('error', error)

            if (doesNeedRefetch(wikiPageLink) === true)
                fetchUrl(url, callback);
            else
                callback(wikiPageLink);

        });
    }

    var getWikiPageFirstLink = function (url, callback) {
        console.log("Searching DB for ", url);
        WikiPageLink.findOne({link: url}, {link: 1, children: 1, path: 1, _id: 0}).exec(function (error, wikiPageLink) {
            if (error)
                console.log('error', error)


            if (doesNeedRefetch(wikiPageLink) === true)
                fetchUrlForFirstLink(url, callback);
            else {
                wikiPageLink.children = [wikiPageLink.children[0]];
                callback(wikiPageLink);
            }

        });
    }

    var doesNeedRefetch = function (wikiPageLink) {
        if (wikiPageLink === undefined || wikiPageLink === null || wikiPageLink.children === undefined)
            return true;

        if (wikiPageLink && wikiPageLink.children && wikiPageLink.children.length === 0)
            return true;

        return false;
    }

    var fetchUrl = function (url, callback) {
        console.log("Fetching", url);
        request(url, function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.log("Error, could not fetch", url);
                callback({error: 'could not browser' + url});
            }

            prepareWikiPageLink(url, body, callback);
        });
    }

    var fetchUrlForFirstLink = function (url, callback) {
        console.log("Fetching", url);
        request(url, function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.log("Error, could not fetch", url);
                callback({error: 'could not browser' + url});
            }

            prepareWikiPageLinkForFirstLink(url, body, callback);
        });
    }

    var prepareWikiPageLinkForFirstLink = function (url, body, callback) {
        linkscrape(url, linkSanitizer.sanitizeBody(body), function (links) {
            var sanitizedLinks = linkSanitizer.sanitizeLinks(url, links);
            var wikiPageLink = new WikiPageLink({link: url, children: sanitizedLinks});
            wikiPageLink.children = wikiPageLink.children[0];
            callback(wikiPageLink);
        });
    }

    var prepareWikiPageLink = function (url, body, callback) {
        linkscrape(url, body, function (links) {
            var sanitizedLinks = linkSanitizer.sanitizeLinks(url, links);
            console.log("Creating WikiPageLink in DB for", url);
            var wikiPageLink = new WikiPageLink({link: url, children: sanitizedLinks});
            wikiPageLink.save(function (error) {
                if (error)
                    console.log("Error creating new WikiPageLink", error);

                console.log("Created WikiPageLink in DB for", url);
            });
            callback(wikiPageLink);
        });
    }

    return {
        getWikiPageLinks: getWikiPageLinks,
        getWikiPageFirstLink: getWikiPageFirstLink
    };
};
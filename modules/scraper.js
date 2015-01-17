module.exports.inject = function (di) {

    var dep = di;
    var linkscrape = dep.linkscrape || require('linkscrape');
    var request = dep.request || require('request');
    var linkSanitizer = dep.linkSanitizer || require('./linkSanitizer.js');

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
                callback(null);
            }

            prepareWikiPageLink(url, body, callback);
        });
    }

    var prepareWikiPageLink = function (url, body, callback) {
        linkscrape(url, body, function (links) {
            var sanitizedLinks = linkSanitizer.sanitize(url, links);
            console.log("Creating WikiPageLink in DB for", url);
            var wikiPageLink = new WikiPageLink({link: url, children: sanitizedLinks});
            wikiPageLink.save(function(error){
                if(error)
                    console.log("Error creating new WikiPageLink");

                console.log("Created WikiPageLink in DB for", url);
            });
            callback(wikiPageLink);
        });
    }


    return {
        getWikiPageLinks: getWikiPageLinks
    };
};
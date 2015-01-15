module.exports.inject = function (di) {

    var dep = di;
    var linkscrape = dep.linkscrape || require('linkscrape');
    var request = dep.request || require('request');
    var linkSanitizer = dep.linkSanitizer || require('./linkSanitizer.js');

    console.log('mongoose is',dep.mongoose);
    var WikiPageLink = dep.WikiPageLink || require('../models/WikiPageLink').inject(dep.mongoose);


    var getWikiPageLinks = function (url, callback) {
        console.log("Finding url in db");

        WikiPageLink.findOne({link: url}).exec(function (error, wikiPageLink) {
            console.log('links', wikiPageLink);
            console.log('error', error);

            if (error)
                console.log('error', error)

            if (wikiPageLink === undefined || wikiPageLink.length === 0)
                fetchUrl(url, callback);
            else
                callback(wikiPageLink);

        });
    }

    var fetchUrl = function (url, callback) {
        console.log("Fetching", url);
        request(url, function (error, response, body) {
            if (error || response.statusCode != 200)
                throw new Error(url + " could not be retrieved");

            prepareWikiPageLink(url, body, callback);
        });
    }

    var prepareWikiPageLink = function (url, body, callback) {
        linkscrape(url, body, function (links) {
            var sanitizedLinks = linkSanitizer.sanitize(links);
            wikiPageLink = new WikiPageLink({link: url, children: sanitizedLinks});
            wikiPageLink.save();
            console.log("calling back with sanitized links");
            callback(wikiPageLink);
        });
    }

    var saveNewWikiPageLink = function (url, sanitizedLinks) {
        WikiPageLink.createAndSave({link: url, children: sanitizedLinks})
    }


    return {
        getWikiPageLinks: getWikiPageLinks
    };
};
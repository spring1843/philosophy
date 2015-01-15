module.exports = exports = function (di) {

    var dep = {};
    var linkscrape = dep.linkscrape || require('linkscrape');
    var request = dep.request || require('request');
    var mongoose = dep.mongoose || require('mongoose');

    mongoose.connect('mongodb://publicdata:rOuqBD3yv2XwJFdUHOtn@ds029051.mongolab.com:29051/heroku_app32713545');

    var linkSanetizer = require('./linkSanitizer.js');

    var wikiPageLinkSchema = new mongoose.Schema({link: 'string', children: []});
    var WikiPageLink = mongoose.model('WikiPageLink', wikiPageLinkSchema);

    var fetchUrl = function (url, callback) {
        console.log("Fetching url")
        request(url, function (error, response, body) {
            if (error || response.statusCode != 200) {
                throw new Error(url + " could not be retrieved");
            }
            linkscrape(url, body, function (links) {
                var sanitizedLinks = linkSanetizer.sanitize(links);
                var wikiPageLink = new WikiPageLink({link: url, children: sanitizedLinks});

                console.log("Storing in db")
                wikiPageLink.save(function (error) {
                    if (error)
                        console.log(error);
                });
                callback(links);
            });
        });
    }

    var getWikiPageLinks = function (url, callback) {
        console.log("Finding url in db");
        WikiPageLink.findOne({link: url}, {_id: 0, link: 1, children: 1}).exec(function (error, links) {


            if (error)
                console.log('error', error)

            console.log("found", links);


            if (links.length === 0) {
                fetchUrl(url, callback);
            } else {
                callback(links);
            }
        });

    }

    return {
        getWikiPageLinks: getWikiPageLinks
    };
}();
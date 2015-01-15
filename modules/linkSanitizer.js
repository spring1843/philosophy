module.exports = exports = function () {

    var links = links;

    var removeElementObjectFromLinks = function () {
        var sanitizedLinks = [];
        for (i in links) {
            link = links[i];
            delete link.element;
            sanitizedLinks.push(link);
        }
        links = sanitizedLinks;
    }
    var removeCitations = function () {
        var sanitizedLinks = [];
        for (i in links) {
            link = links[i];
            if (link.link != null)
                sanitizedLinks.push(link);
        }
        links = sanitizedLinks
    }
    var removeExternalLinks = function () {
        var sanitizedLinks = [];
        var wikiLinkPattern = "http://en.wikipedia.org/wiki/";
        for (i in links) {
            link = links[i];
            if (link.href != link.link && link.link.indexOf(wikiLinkPattern) === 0)
                sanitizedLinks.push(link);
        }
        links = sanitizedLinks
    }

    var removeNonArticlePages = function () {
        var sanitizedLinks = [];
        for (i in links) {
            link = links[i];
            if (link.href.indexOf(':') == -1)
                sanitizedLinks.push(link);
        }
        links = sanitizedLinks
    }

    var removeImageLinks = function () {
        var sanitizedLinks = [];
        for (i in links) {
            link = links[i];
            if (link.text == link.html && link.text != '')
                sanitizedLinks.push(link);
        }
        links = sanitizedLinks
    }

    var keepOnlyLinks = function () {
        var sanitizedLinks = [];
        for (i in links) {
            link = links[i];
            sanitizedLinks.push(link.link);
        }
        links = sanitizedLinks
    }

    var makeLinksUnique = function () {
        var sanitizedLinks = [];
        var uniqueLinks = [];

        for (i in links) {
            link = links[i];
            if (uniqueLinks.indexOf(link) == -1) {
                uniqueLinks.push(link);
                sanitizedLinks.push(link);
            }
        }
        links = sanitizedLinks
    }

    var sanitize = function (uncleanLinks) {
        links = uncleanLinks;
        removeElementObjectFromLinks();
        removeCitations();
        removeExternalLinks();
        removeNonArticlePages();
        removeImageLinks();
        keepOnlyLinks();
        makeLinksUnique();
        return links;
    }

    return {
        sanitize: sanitize
    };
}();
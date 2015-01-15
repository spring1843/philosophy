module.exports = exports = function(di) {

	var scraper = require('./scraper');

	var dep = {};

	var linksToPhilosophy = function(wikiPageLink){
		if(wikiPageLink.children.indexOf('http://en.wikipedia.org/wiki/Philosophy') != -1){
			return true;
		}else{
			return false;
		}

	}

	var find = function(url, callback) {
	
		console.log("scraping", url);
		scraper.getWikiPageLinks(url, function(wikiPageLink){

				console.log("links to?", linksToPhilosophy(wikiPageLink));
				if(linksToPhilosophy(wikiPageLink))
						callback(wikiPageLink);
		});
	}

  return {
    find: find
  };
}();
module.exports = exports = function(di) {

	var dep = {};
	var linkscrape = dep.linkscrape || require('linkscrape');
	var request = dep.request || require('request');



  return {


    getWikiPageLinks: function(url) {
			request(url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body) // Print the google web page.
			  }
			});
	}
  };
}();
var express = require('express');
var app = express();

var scraper = require('./modules/scraper');

app.get('/philosophy', function(req, res){
	var url = req.query.url;
	scraper.getWikiPageLinks(url);
	res.send('hello world');
});

app.listen(3000);
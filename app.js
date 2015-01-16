var express = require('express');
var app = express();

var di = {};
di.mongoose = require('mongoose');
di.mongoose.connect('mongodb://publicdata:rOuqBD3yv2XwJFdUHOtn@ds029051.mongolab.com:29051/heroku_app32713545');
di.WikiPageLink = require('./models/WikiPageLink').inject(di);

var pathToPhilosophy = require('./modules/pathToPhilosophy').inject(di);
var scraper = require('./modules/scraper').inject(di);

app.get('/pathToPhilosophy', function (request, response) {
    pathToPhilosophy.find(request.query.url, function (data) {
        response.json(data);
        response.end;
    });
});

app.get('/scrape', function (request, response) {
    scraper.getWikiPageLinks(request.query.url, function (data) {
        response.json(data);
        response.end;
    });
});

app.use(express.static('./public'));

app.listen(3000);
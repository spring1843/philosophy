var express = require('express');
var app = express();


//var config = require('./configs').load();

var di = {};
di.cheerio = require('cheerio');
di.mongoose = require('mongoose');
di.mongoose.connect("mongodb://publicdata:rOuqBD3yv2XwJFdUHOtn@ds029051.mongolab.com:29051/heroku_app32713545");
di.WikiPageLink = require('./models/WikiPageLink').inject(di);
di.WikiPath = require('./models/WikiPath').inject(di);

app.get('/pathToPhilosophy', function (request, response) {
    var pathToPhilosophy = require('./modules/pathToPhilosophy').inject(di);
    var findType = request.query.type || 'bfs';
    console.log(request.query.url,findType);
    pathToPhilosophy.find(request.query.url,findType, function (data) {
            response.json(data);
            response.end;
    });
});

app.get('/scrape', function (request, response) {
    var scraper = require('./modules/scraper').inject(di);
    scraper.getWikiPageLinks(request.query.url, function (data) {
            response.json(data);
            response.end;
    });
});

app.use(express.static('./public'));
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log("Get to philosophy app is running at localhost:" + app.get('port'));
});
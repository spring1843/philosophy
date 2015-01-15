var express = require('express');
var app = express();

var di = {};
di.mongoose = require('mongoose');
di.mongoose .connect('mongodb://publicdata:rOuqBD3yv2XwJFdUHOtn@ds029051.mongolab.com:29051/heroku_app32713545');


var pathToPhilosophy = require('./modules/pathToPhilosophy').inject(di);
var scraper = require('./modules/scraper').inject(di);

app.get('/pathToPhilosophy', function(request, response){

});

app.get('/scrape', function(request, response){
    scraper.getWikiPageLinks(request.query.url, function(data){
        response.json(data);
        response.end;
    });
});

app.listen(3000);